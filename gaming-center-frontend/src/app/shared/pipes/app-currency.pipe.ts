import { Pipe, PipeTransform } from '@angular/core';
import { SettingsService } from '../../core/services/settings.service';

@Pipe({
  name: 'appCurrency',
  standalone: true,
  pure: false
})
export class AppCurrencyPipe implements PipeTransform {
  constructor(private settingsService: SettingsService) {}

  transform(value: number | null | undefined): string {
    const num = value ?? 0;
    if (isNaN(num)) return '0 ' + this.settingsService.getCurrencySymbol();
    const formatted = num.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return formatted + ' ' + this.settingsService.getCurrencySymbol();
  }
}
