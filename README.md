# Secret Services - Topi Gang

Static classified-database style website built from `C:\Users\Aman\Downloads\database.xlsx`.

## Run

Start a local static server from this folder:

```powershell
python -m http.server 4173
```

Open:

```text
http://localhost:4173/
```

## Login

Use the Member ID and Password values from `data/members.json`. The generated IDs come from the attached Excel database, for example:

```text
TG8477F / amanjeet@2009
TG7827D / vishesh@2009
TG7854G / aarab@2087
```

## Features

- Power-on animation, CRT flicker, boot terminal, login, fingerprint scan, face scan, glitch transition, welcome screen, access granted flow.
- Static authentication from `data/members.json`, with a temporary session only for the current access flow.
- Responsive personnel dashboard for desktop, tablet, and mobile.
- Search privacy rules: the logged-in member sees full self details; other results show masked names and silhouette artwork only.
- Hidden terminal with `Ctrl + Shift + T`, plus logo-click hidden panel and Konami-code developer mode.
- Optional synthesized UI sound toggled in the interface.

## Data Notes

The workbook did not include phone, address, blood group, or real profile photos. Those fields are preserved as `CLASSIFIED`, and local SVG profile/silhouette assets were generated for each member.
