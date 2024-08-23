# Rulesets

## Ruleset Types
There are currently two types of rulesets:

- **All Messages**: Checks all messages the client receives.
- **Player Messages**:
  - Only checks messages sent by a player.
  - If enabled, the player who sent the message will be muted.
  - Currently only supports Hypixel's chat format with a valid Minecraft username
    (3-16 alphanumeric characters).
  - Only the content of the message is sent to your rules.

You can switch between these types by editing a rule and clicking the top-leftmost button.

## Inverse Comparisons
By clicking the green/red button to the left of a comparison strategy, you can invert the
comparison result. If a comparison is inverted, the button will turn red, and a strikethrough
will appear through the strategy.

## Testing Rulesets
You can test a ruleset by pressing the test icon (two lines with a check/x) when viewing a
ruleset or a rule. If the ruleset checks player messages only, input only the content of the
message. After entering a test message, an icon will appear to the right of the input bar,
indicating whether the message will appear in chat.

# Rules

Rules can compare two types of messages: **player messages** and **chat messages**.

- **Player messages**: Removes player info (e.g., name, rank, level) from the string before
  evaluating it.
- **Chat messages**: Includes the entire message.

Rules can compare strings using five strategies: `[STARTS WITH]`, `[ENDS WITH]`, `[CONTAINS]`,
`[EQUALS]`, and `[REGEX]`. While RegEx offers more flexibility, it is not recommended for
beginners. You can create Regular Expressions using tools like [RegExr](https://regexr.com).
Additionally, rules can use the AND/OR operators between different comparisons.

## Case Sensitivity
All strategies, except RegEx, are case-insensitive. To make RegEx case-insensitive, start your
code with `(?i)` (embedded flag expression). Case insensitivity for all strategies is a planned
feature.

## AND Statements
In rules with both AND and OR statements, AND statements are evaluated after OR statements. An
AND statement requires both preceding and succeeding comparisons to be true.

> `[STARTS WITH] "Hello" {AND} [ENDS WITH] "world!"`  
> This rule will only remove messages that start with "Hello" and end with "world!"

## OR Statements
OR statements are evaluated first. If either the preceding or succeeding comparison matches,
the OR statement will be true.

> `[STARTS WITH] "Hello" {OR} [STARTS WITH] "Hey"`  
> This rule will remove any message that starts with either "Hello" or "Hey".

> `[STARTS WITH] "Hello" {OR} [STARTS WITH] "Hey" {AND} [ENDS WITH] "world!"`  
> This rule will remove any message that starts with "Hello" and ends with "world!", or any
  message that starts with "Hey" and ends with "world!"

# Common Issues

## Text Rendering/Spacing
Some text, especially long lines and input boxes, may appear offset due to your texture pack's
font. Try disabling your texture packs if this issue occurs.

## RegEx Parsing Errors
If your RegEx contains errors, the text input will turn red, and you may see occasional
warnings in chat. Common causes include:
- Mismatched parentheses/brackets.
- Unescaped characters.
  - Add a backslash (`\`) before special characters that should appear in chat (e.g., `$`,
    `^`, `*`, `(`, `)`, `+`, `[`, `]`, `?`, `.`, `|`).
- Unsupported features.
  - Some features, such as comments, may not be supported by Java's RegEx.

You can paste your RegEx into tools like [RegExr](https://regexr.com) or
[regex101](https://regex101.com) to identify errors.

# Bug Reports & Support
If you encounter a bug with this module, create an issue on
[GitHub](https://github.com/cognitivitydev/HyJanitor/issues) or ping me (@cognitivity) on
[ChatTriggers' Discord](https://discord.gg/ChatTriggers).

# Planned Features
- RegEx flags
- Case insensitivity for all modes
- HUD customization
- Rule naming
- Rule comments