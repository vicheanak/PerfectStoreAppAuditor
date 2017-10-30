import { NgModule } from '@angular/core';
import { StoreModalComponent } from './store-modal/store-modal';
import { ConditionModalComponent } from './condition-modal/condition-modal';
@NgModule({
	declarations: [StoreModalComponent,
    ConditionModalComponent],
	imports: [],
	exports: [StoreModalComponent,
    ConditionModalComponent]
})
export class ComponentsModule {}
