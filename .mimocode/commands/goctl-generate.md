---
name: goctl-generate
description: Generate go-zero API code using goctl with correct configuration.
---

# Goctl Generate

## Correct Command

Always run goctl on `main.api`, NOT on sub-module `.api` files:

```bash
goctl api go -api app/api/main.api -dir app/ -style go_zero
```

## Why main.api?

Sub-module `.api` files will fail with:
```
type BaseResp not defined
```

Because `BaseResp` is defined in `main_types.api`.

## Common Errors

### Error: "type BaseResp not defined"
**Cause**: Running goctl on sub-module `.api` file
**Fix**: Run on `main.api` instead

### Error: "api file not found"
**Cause**: Wrong path to `.api` file
**Fix**: Verify path with `ls app/api/main.api`

## Verification

After generation, verify:
1. `*_types.go` files created
2. `*_logic.go` files created
3. No TypeScript errors in generated code

## Related Knowledge

- MEMORY.md line 106: "goctl 生成必须对 main.api 运行"
