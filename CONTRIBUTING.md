# Contributing to Heta Extension

Cảm ơn bạn quan tâm đến việc đóng góp cho Heta Extension! 🎉

## Làm thế nào để đóng góp

### Báo cáo Bug

Nếu bạn tìm thấy bug:

1. Kiểm tra [Issues](../../issues) xem bug đã được báo cáo chưa
2. Nếu chưa, tạo issue mới với:
   - Mô tả rõ ràng về bug
   - Các bước để reproduce
   - Expected behavior vs actual behavior
   - Screenshots nếu có
   - Browser version & OS

### Đề xuất Feature

1. Kiểm tra [CHANGELOG.md](./CHANGELOG.md) xem feature có trong roadmap không
2. Tạo issue mới với label "enhancement"
3. Mô tả feature và use case
4. Giải thích tại sao feature này hữu ích

### Pull Requests

1. Fork repo
2. Tạo branch mới: `git checkout -b feature/your-feature-name`
3. Commit changes: `git commit -am 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature-name`
5. Tạo Pull Request

### Development Setup

```bash
# Clone repo
git clone https://github.com/yourusername/heta.git
cd heta

# Install dependencies
npm install

# Run dev server
npm run dev

# Build
npm run build
```

### Coding Standards

- Sử dụng React hooks
- Component names: PascalCase
- Function names: camelCase
- File names: PascalCase cho components, camelCase cho utilities
- Comments: Tiếng Anh hoặc Tiếng Việt đều OK
- Indentation: 2 spaces

### Testing

Trước khi submit PR:

1. Test all features manually
2. Check console cho errors
3. Test trên cả Chrome và Edge
4. Verify build works: `npm run build`

### Commit Messages

Format:

```
type: short description

Longer description if needed
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, styling
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:

```
feat: add export profiles feature
fix: resolve batch size validation issue
docs: update USAGE.md with new examples
```

## Code of Conduct

- Tôn trọng mọi người
- Constructive feedback
- Focus on the code, not the person

## Questions?

Có thắc mắc? Tạo issue với label "question"

Cảm ơn bạn đã đóng góp! 🚀
