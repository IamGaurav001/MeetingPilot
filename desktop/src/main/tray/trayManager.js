/**
 * System tray manager.
 *
 * Allows MeetingPilot to minimize to the system tray
 * and provides quick-access controls.
 */

// import { Tray, Menu } from 'electron';
// import { join } from 'path';

let tray = null;

/**
 * Create and configure the system tray.
 *
 * @param {import('electron').BrowserWindow} _mainWindow
 */
export function createTray(_mainWindow) {
  // Phase 2: Use actual icon asset
  // tray = new Tray(join(__dirname, '../../resources/icon.png'));

  // For now, tray creation is deferred until we have icon assets
  // This function is called but is a no-op in Phase 1

  return tray;
}

/**
 * Destroy the tray on app quit.
 */
export function destroyTray() {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}
