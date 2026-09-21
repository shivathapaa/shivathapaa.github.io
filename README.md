# shivathapaa.github.io

My portfolio. Live at **<https://shivathapaa.github.io/>**.

This repository only holds the site. If you are looking for the code I actually write,
it is in the projects below.

## Projects

| Project | What it is | Published on |
| --- | --- | --- |
| [Nepali Date Picker](https://github.com/shivathapaa/Nepali-Date-Picker) | Bikram Sambat pickers and a Compose-free conversion engine. One Kotlin `core` compiles out to five ecosystems. | [Maven Central](https://central.sonatype.com/namespace/io.github.shivathapaa), [pub.dev](https://pub.dev/packages/nepali_date_picker_kmp), [npm](https://www.npmjs.com/package/@nepali-date-picker/web-component), [SPM](https://github.com/shivathapaa/Nepali-Date-Picker-SPM), [klibs.io](https://klibs.io/project/shivathapaa/Nepali-Date-Picker) |
| [Aalekh](https://github.com/shivathapaa/Aalekh) | Gradle plugin that extracts, renders and enforces multi-module architecture from the build. | [Gradle Plugin Portal](https://plugins.gradle.org/plugin/io.github.shivathapaa.aalekh) |
| [KMP-Logger](https://github.com/shivathapaa/KMP-Logger) | Lightweight structured logging for Kotlin Multiplatform. | [Maven Central](https://central.sonatype.com/artifact/io.github.shivathapaa/logger) |
| [nepali_calendar_utils](https://github.com/shivathapaa/nepali_calendar_utils) | The same calendar tables, in Python. | [PyPI](https://pypi.org/project/nepali-calendar-utils/) |

## Elsewhere

[GitHub](https://github.com/shivathapaa) ·
[LinkedIn](https://www.linkedin.com/in/shivathapaa/) ·
[Medium](https://medium.com/@shivathapaa) ·
[dev.to](https://dev.to/shivathapaa)

## About the site

One page of static HTML, one stylesheet, one script. No framework, no build step, no
tracker, and no external requests at runtime. Fonts are self-hosted.

```
index.html        the whole page
css/styles.css    all styles
js/main.js        nav, ticker, scroll-spy, Medium feed
fonts/            Cormorant Garamond (SIL OFL 1.1)
assets/           favicon and Open Graph image
```

Serve it locally with any static server:

```bash
python3 -m http.server 8080
```
