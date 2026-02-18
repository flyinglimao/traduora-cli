# CLI 指令

## project

- `traduora project add <name> [--description ...] [--label ...]`
- `traduora project list`
- `traduora project update <id> [--name ...] [--description ...] [--label ...]`
- `traduora project remove <id>`
- `traduora project status [id]`
- `traduora project use <id>`

## term

- `traduora term add <value> [--project ...] [--label ...]`
- `traduora term list [--project ...]`
- `traduora term update <value> --new-value <value> [--project ...] [--label ...]`
- `traduora term delete <value> [--project ...]`

## translation

- `traduora translation use <locale_code>`
- `traduora translation list [--project ...] [--locale ...]`
- `traduora translation add --term <value> --value <text> [--project ...] [--locale ...] [--label ...]`
- `traduora translation update --term <value> --value <text> [--project ...] [--locale ...] [--label ...]`
- `traduora translation delete --term <value> [--project ...] [--locale ...]`

## export

- `traduora export [--project ...] [--locale ...] [--format ...] [--output ...]`

支援格式：

- `androidxml`
- `csv`
- `xliff12`
- `jsonflat`
- `jsonnested`
- `yamlflat`
- `yamlnested`
- `properties`
- `po`
- `strings`
