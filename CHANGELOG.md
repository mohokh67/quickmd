# Changelog

## [0.3.0](https://github.com/mohokh67/quickmd/compare/quickmd-v0.2.1...quickmd-v0.3.0) (2026-04-10)


### Features

* **ipc+sidebar+theme:** open-folder-dialog, folder picker, empty state, persistence ([2bee529](https://github.com/mohokh67/quickmd/commit/2bee529211a553062dacb889974bc957d5c52bc7))
* **ipc:** add open-folder-dialog channel + openFolderDialog wrapper ([e98ea30](https://github.com/mohokh67/quickmd/commit/e98ea306fc6ed569f091c0cb5c09af94a28ff274))
* **ipc:** implement file I/O handlers — read, write, list-directory, get-home-dir ([#11](https://github.com/mohokh67/quickmd/issues/11)) ([ff6ba95](https://github.com/mohokh67/quickmd/commit/ff6ba95a28731af28ebc643b1923c6fcc52a093c))
* **ipc:** implement open/save file dialog handlers ([#12](https://github.com/mohokh67/quickmd/issues/12)) ([37874d8](https://github.com/mohokh67/quickmd/commit/37874d8ec89a44ae2ede8051d269e69ad23ceef4))
* migrate QuickMD from Tauri to Electron (scaffold, issue [#10](https://github.com/mohokh67/quickmd/issues/10)) ([2a733e4](https://github.com/mohokh67/quickmd/commit/2a733e4a7543b0c39df942939d837e6620be0390))
* scaffold electron-vite — replaces tauri with electron ([82bb9b3](https://github.com/mohokh67/quickmd/commit/82bb9b3ec78748aa509e052b1dc708c3fc744d9f)), closes [#10](https://github.com/mohokh67/quickmd/issues/10)
* **sidebar:** empty state, folder picker, persistence via electron-store ([3b617b1](https://github.com/mohokh67/quickmd/commit/3b617b1be8d4713676a3783059a96d16ec12d4e4))
* **store:** add electron-store IPC — store-get/store-set channels + native.ts wrappers ([b30ccd6](https://github.com/mohokh67/quickmd/commit/b30ccd69a8f2acb09ea5e030208c885f665ea7be))
* **store:** settings store IPC — electron-store with store-get/store-set channels ([b3c3ab2](https://github.com/mohokh67/quickmd/commit/b3c3ab2a530b2a0b62f4300916922809aafaa17d))
* **theme:** persist ui.theme to store, restore on launch ([09580ba](https://github.com/mohokh67/quickmd/commit/09580ba9e843d6fe4c4f3abbb2fa7b9fc644dde2))
* **toolbar:** show app version from package.json next to QuickMD ([da279b1](https://github.com/mohokh67/quickmd/commit/da279b1bd08c62dc693782452e1420bf37e7c0d5))


### Bug Fixes

* **lint:** fix exhaustive-deps warnings, apply prettier ([cc82403](https://github.com/mohokh67/quickmd/commit/cc824035a9dd9863858a7c32a7fb57aa5e49fdf6))
* remove type:module, point main at index.js — fixes electron dev startup ([73da140](https://github.com/mohokh67/quickmd/commit/73da14094bc3dc899c225d1862a28a8bd9a7b148))

## [0.2.1](https://github.com/mohokh67/quickmd/compare/quickmd-v0.2.0...quickmd-v0.2.1) (2026-04-10)


### Bug Fixes

* **ci:** merge build jobs into release-please workflow ([66d97d7](https://github.com/mohokh67/quickmd/commit/66d97d7bad3c53cde46f550ede7301ed51d2629a))
* **ci:** merge build jobs into release-please workflow ([dac3a51](https://github.com/mohokh67/quickmd/commit/dac3a51d3d7caefd859d4a8a3b2cf90c6917f31b))

## [0.2.0](https://github.com/mohokh67/quickmd/compare/quickmd-v0.1.0...quickmd-v0.2.0) (2026-04-10)


### Features

* **ci:** add manual trigger to release-please workflow ([9cf109a](https://github.com/mohokh67/quickmd/commit/9cf109a09a9791f36d7a53fcbffa54df4d3103ed))
* **ci:** add manual trigger to release-please workflow ([a3e3704](https://github.com/mohokh67/quickmd/commit/a3e3704ac61c0a85e444f8561445f4913c9edb9b))
* **ci:** rename release artifacts with descriptive OS/arch names ([d5433bf](https://github.com/mohokh67/quickmd/commit/d5433bfb5d2b87cba6f279f17bcce2b5443a4204))


### Bug Fixes

* **ci:** add bootstrap-sha to release-please config ([860347f](https://github.com/mohokh67/quickmd/commit/860347f3d3ad9d1300bb3622ed511cd4c042738f))
* **ci:** move bootstrap-sha to root level outside packages block ([4af6649](https://github.com/mohokh67/quickmd/commit/4af6649095b1d68fc4142cdfa7ded6d0bcdf37b2))
* **ci:** move release-please config to packages format with bootstrap-sha ([e662591](https://github.com/mohokh67/quickmd/commit/e662591ad5e10c5b330d79ddef4208b060c522e4))
* **ci:** move release-please config to packages format with bootstrap-sha ([a599b48](https://github.com/mohokh67/quickmd/commit/a599b482d4a69ef6050d5694f748a93cd72b7811))
* **ci:** release-please bootstrap + descriptive artifact names ([6e2f912](https://github.com/mohokh67/quickmd/commit/6e2f9121f1ff62d0ab8e62428804223c22638a05))
