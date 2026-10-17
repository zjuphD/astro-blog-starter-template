# BioSeeki Mac Beta 0.1.2 download

The download page and English download buttons use the verified release in
`src/data/desktop-release.json`. The existing homepage presentation and shared
Aiseeki routes are retained. The installer is stored in the existing
`bioseeki-downloads` R2 bucket and served by `dl.bioseeki.com`.

- Platform: Apple silicon, macOS 14 or later.
- Installer: https://dl.bioseeki.com/desktop/beta/0.1.2/BioSeeki-Beta-0.1.2-arm64.dmg
- Checksum: the same URL with `.sha256` appended.
- Bytes: 686850308.
- SHA-256: `3e5b8c21cf0afb81ce07a7d187013a0d0135b0cc4aa27a7416a205e72872291d`.
- The app and DMG have Apple notarization tickets and passed Gatekeeper.

Before changing a future release, verify the uploaded file through its public
URL, then update the release metadata. Keep versioned installer URLs immutable.
Desktop announcement and update catalogs are administered separately.
