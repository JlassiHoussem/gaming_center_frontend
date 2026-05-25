import { Injectable } from '@angular/core';
import { Parametres } from '../../shared/models/rapport.model';

const KEY = 'gc_settings';

const DEFAULTS: Parametres = {
  nomEtablissement: 'Gaming Center Pro',
  devise: 'EUR',
  fuseauHoraire: 'Europe/Paris',
  typesAppareils: ['PC', 'PS4', 'PS5', 'Xbox', 'Simulateur'],
  categoriesBuffet: ['Boissons', 'Snacks', 'Repas']
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private _current: Parametres;

  get current(): Parametres {
    const local = loadSettings();
    if (local) this._current = local;
    return this._current;
  }

  constructor() {
    this._current = loadSettings() ?? { ...DEFAULTS };
  }

  getCurrencySymbol(): string {
    const map: Record<string, string> = {
      'EUR': '\u20AC', 'USD': '$', 'MAD': 'DH', 'EGP': '\u00A3', 'TDN': 'DT'
    };
    return map[this.current.devise] || this.current.devise;
  }
}

export function loadSettings(): Parametres | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && p.devise) return p;
    }
  } catch {}
  return null;
}

export function saveSettings(p: Parametres) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}
