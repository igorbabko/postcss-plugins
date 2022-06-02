<!-- Available Variables: -->
<!-- <humanReadableName> PostCSS Your Plugin -->
<!-- <exportName> postcssYourPlugin -->
<!-- <packageName> @csstools/postcss-your-plugin -->
<!-- <packagePath> plugins/postcss-your-plugin -->
<!-- <cssdbId> your-feature -->
<!-- <specUrl> https://www.w3.org/TR/css-color-4/#funcdef-color -->
<!-- <example.css> file contents for examples/example.css -->
<!-- <header> -->
<!-- <usage> usage instructions -->
<!-- <env-support> -->
<!-- <link-list> -->
<!-- to generate : npm run docs -->

<header>

[<humanReadableName>] transforms :not() W3C CSS level 4 pseudo classes to :not() CSS level 3 selectors following the [Selectors 4 Specification].

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

⚠️ Only lists of simple selectors (`:not(.a, .b)`) will work as expected.
Complex selectors (`:not(.a > .b, .c ~ .d)`) can not be downgraded.

<usage>

<env-support>

<link-list>
[Selectors 4 Specification]: <specUrl>