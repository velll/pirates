import { t } from './data/i18n';
import { logger } from './lib/logger';

import { URLParams } from "./lib/url/params";
import { initialize } from "./initializer";

const [gameId, playerFleet] = new URLParams(window.location.href).collect(['game', 'fleet']);

window.onload = () => initialize(gameId, playerFleet);

(window as any).t = t;
(window as any).logger = logger;
