import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanProperty'
})
export class HumanPropertyPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    if (!value) {
      return value;
    }

    return (value[0].toLocaleUpperCase() + value.toLocaleLowerCase().slice(1)).split('_').join(' ');
  }
}
