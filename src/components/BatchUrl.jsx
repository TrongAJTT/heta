import React, { useState, useEffect } from "react";
import {
  generateUrls,
  openUrlsInBatches,
  openAllUrls,
} from "../utils/urlUtils";

const BatchUrl = ({ currentState, onStateChange }) => {
  const [urlPattern, setUrlPattern] = useState("");
  const [startId, setStartId] = useState("");
  const [endId, setEndId] = useState("");
  const [generatedUrls, setGeneratedUrls] = useState([]);
  const [batchSize, setBatchSize] = useState(8);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  // Load state from props
  useEffect(() => {
    if (currentState) {
      setUrlPattern(currentState.urlPattern || "");
      setStartId(currentState.startId || "");
      setEndId(currentState.endId || "");
      setGeneratedUrls(currentState.generatedUrls || []);
      setBatchSize(currentState.batchSize || 8);
    }
  }, [currentState]);

  // Save state whenever it changes
  // Chỉ lưu state khi tạo link (handleGenerateUrls)

  const handleGenerateUrls = () => {
    setError("");
    try {
      const urls = generateUrls(urlPattern, startId, endId);

      // Warning for large batches
      if (urls.length > 500) {
        if (
          !confirm(
            `Bạn sắp tạo ${urls.length} URLs. Số lượng lớn có thể làm chậm browser. Tiếp tục?`
          )
        ) {
          return;
        }
      }

      setGeneratedUrls(urls);
      setProgress(null);

      // Lưu state khi tạo link
      onStateChange({
        urlPattern,
        startId,
        endId,
        generatedUrls: urls,
        batchSize,
      });
    } catch (err) {
      setError(err.message);
      setGeneratedUrls([]);
    }
  };

  const handleOpenAll = async () => {
    if (generatedUrls.length === 0) return;

    // Warning for opening many tabs at once
    if (generatedUrls.length > 50) {
      if (
        !confirm(
          `Bạn sắp mở ${generatedUrls.length} tabs cùng lúc. Điều này có thể làm chậm browser. Tiếp tục?`
        )
      ) {
        return;
      }
    }

    setProgress({ message: "Đang mở tất cả links..." });
    await openAllUrls(generatedUrls);
    setProgress({ message: `Đã mở ${generatedUrls.length} links` });
  };

  const handleOpenInBatches = async () => {
    if (generatedUrls.length === 0) return;

    setProgress({
      currentBatch: 0,
      totalBatches: 0,
      urlsOpened: 0,
      totalUrls: generatedUrls.length,
    });

    await openUrlsInBatches(generatedUrls, batchSize, (progressData) => {
      setProgress(progressData);
    });

    setProgress({ message: `Hoàn thành! Đã mở ${generatedUrls.length} links` });
  };

  const handleClearUrls = () => {
    setGeneratedUrls([]);
    setProgress(null);
    setError("");
  };

  return (
    <div className="batch-url-container">
      <div className="input-section">
        <div className="form-group">
          <label htmlFor="urlPattern">
            URL Pattern (sử dụng {"{id}"} làm placeholder):
          </label>
          <input
            type="text"
            id="urlPattern"
            value={urlPattern}
            onChange={(e) => setUrlPattern(e.target.value)}
            placeholder="https://example.com/page/{id}"
            className="input-field"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startId">Start ID:</label>
            <input
              type="number"
              id="startId"
              value={startId}
              onChange={(e) => setStartId(e.target.value)}
              placeholder="1"
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="endId">End ID:</label>
            <input
              type="number"
              id="endId"
              value={endId}
              onChange={(e) => setEndId(e.target.value)}
              placeholder="10"
              className="input-field"
            />
          </div>
        </div>

        <button onClick={handleGenerateUrls} className="btn btn-primary">
          Tạo Links
        </button>

        {error && <div className="error-message">{error}</div>}
      </div>

      {generatedUrls.length > 0 && (
        <div className="urls-section">
          <div className="section-header">
            <h3>Batch Links ({generatedUrls.length} links)</h3>
            <button
              onClick={handleClearUrls}
              className="btn btn-secondary btn-sm"
            >
              Xóa
            </button>
          </div>

          <textarea
            className="urls-textarea"
            value={generatedUrls.join("\n")}
            readOnly
            rows={8}
          />

          <div className="batch-controls">
            <div className="form-group">
              <label htmlFor="batchSize">Batch Size:</label>
              <input
                type="number"
                id="batchSize"
                value={batchSize}
                onChange={(e) =>
                  setBatchSize(Math.max(1, parseInt(e.target.value) || 1))
                }
                min="1"
                className="input-field input-small"
              />
            </div>

            <div className="button-group">
              <button onClick={handleOpenAll} className="btn btn-success">
                Mở Tất Cả
              </button>
              <button onClick={handleOpenInBatches} className="btn btn-primary">
                Mở Theo Batch
              </button>
            </div>
          </div>

          {progress && (
            <div className="progress-section">
              {progress.message ? (
                <div className="progress-message">{progress.message}</div>
              ) : (
                <div className="progress-info">
                  <div className="progress-text">
                    Batch {progress.currentBatch}/{progress.totalBatches} - Đã
                    mở {progress.urlsOpened}/{progress.totalUrls} links
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          (progress.urlsOpened / progress.totalUrls) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BatchUrl;
