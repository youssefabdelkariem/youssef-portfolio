/** The five stages of the shot 002 frame 36 breakdown, shared by the case study and the walkthrough. */
import { picture } from './media';

export const passes = [
  { id: 'comp', label: 'Final composite', pic: picture('lenses', 'Final composite of the camera module, shot 002 frame 36.', '(min-width: 900px) 70vw, 100vw'),
    caption: 'The composited frame: the denoised beauty with a local gain on the engraved lettering, a highlight roll-off and the AgX display transform.' },
  { id: 'noisy', label: 'Undenoised render', pic: picture('pass-noisy', 'The same frame before denoising, through the same display transform.', '(min-width: 900px) 70vw, 100vw'),
    caption: 'The Cycles "Noisy Image" pass at 512 samples, before denoising, shown through the same display transform.' },
  { id: 'glossy', label: 'Glossy', pic: picture('pass-glossy', 'Glossy lighting pass: the phone body and lens rings lit, the background black.', '(min-width: 900px) 70vw, 100vw'),
    caption: 'Direct plus indirect glossy lighting. It shows where the lens rings, bevels and glass catch the studio lights.' },
  { id: 'transmission', label: 'Transmission', pic: picture('pass-transmission', 'Transmission lighting pass: light passing through the lens glass.', '(min-width: 900px) 70vw, 100vw'),
    caption: 'Direct plus indirect transmission: light that passes through the lens glass and the flash window.' },
  { id: 'normal', label: 'Surface normals', pic: picture('pass-normal', 'Surface normal pass mapped to colour, showing the orientation of the body and lenses.', '(min-width: 900px) 70vw, 100vw'),
    caption: 'The normal pass mapped to colour. It records the orientation of every surface and is a data pass, not a colour-managed image.' },
];
