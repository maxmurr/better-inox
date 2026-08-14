# Triage Labels

Canonical triage roles map to GitHub labels as follows:

| Canonical role    | GitHub label   | Meaning                                  |
| ----------------- | -------------- | ---------------------------------------- |
| `needs-triage`    | `needs-triage` | Maintainer needs to evaluate this issue  |
| `needs-info`      | `question`     | Waiting on reporter for more information |
| `ready-for-agent` | `factory`      | Ready for the eve Software Factory       |
| `ready-for-human` | `help wanted`  | Requires human implementation            |
| `wontfix`         | `wontfix`      | Will not be actioned                     |

## Factory assignment policy

`factory` marks executable tickets and sub-issues. Specs and parent issues
created by `to-spec` stay unlabeled; tickets created by `to-tickets` receive
`factory`. An explicit user request overrides this policy.

For other canonical roles, use the corresponding GitHub label.
