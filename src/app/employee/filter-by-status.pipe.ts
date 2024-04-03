import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByStatus',
  standalone: true,
})
// @Pipe({ name: 'filterByStatus' })
export class FilterByStatusPipe implements PipeTransform {

  transform(value: any[], status: boolean): any[] {
    return value.filter((item) => item.status === status);
  }

}

