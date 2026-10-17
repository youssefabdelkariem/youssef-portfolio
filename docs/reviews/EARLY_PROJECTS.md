# Earlier work: project pages

Status: implementation record for the seven learning-stage project pages at `/work/<slug>/`, added 2026-10-17 on the owner's direction. The owner supplied the renders (kept outside the repository) and said the projects are mostly beginner, improving-level work and that the car models come from the Traffiq add-on. Related: [Aurelia walkthrough record](AURELIA_WALKTHROUGH.md).

## Published

| Page | Source folder | Year | Frames |
|---|---|---|---|
| Golden Hour Departure | Aircraft Render 2023 | 2023 | final, alternate grade, grey viewport view |
| Cedar & Concrete | Garage Render 2022 | 2022 | two grades, clay view |
| Cobalt Charge | Audi Render 2021 | 2021 | final |
| Night Shift | Helicopter 2021 | 2021 | final |
| Crimson Corridor | Red BMW | not stated | final, lifted exposure |
| Earthlight | Earth-Spaceship | not stated | three frames |
| Still Water | Boat Render | not stated | two frames |

The titles are new names chosen for the site. Years come from the folder names only. Tools are listed only where the frames show them (Blender's viewport in the grey and clay views); the Traffiq credit appears on the three pages with car models. Copy describes what the frames show and states plainly that these are learning-stage projects. Derivatives are made by `scripts/projects/make-project-images.py` (AVIF 960/1440/1920 px plus a JPEG fallback, 5.1 MB in total); the manifest is pruned from `dist`.

## Held back

- **3D Metal Ball 2020:** the folder was empty when checked.
- **3D Spaceship (video):** the clip shows aerial city footage with a third-party brand billboard and a purple sky; no spaceship is visible in the sampled frames. It is not published until the owner confirms the footage is theirs, what the visual effect was, and that the brand content may be shown.

## Links

The ArtStation profile (`https://www.artstation.com/stampvfx`) is linked from the work index and each project page. It is on the verified outbound list in `scripts/check-dist.mjs`.
