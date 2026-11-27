import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GymService } from '../../../services/gym.service';
import { Gym } from '../../../../interfaces/gym';
import { AlertService } from '../../../services/alert.service';
import { CustomError } from '../../../../interfaces/CustomError';
import { getErrorCode, getErrorMessage } from '../../../shared/utils/http-error';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { PluralPipe } from '../../../shared/pipes/plural.pipe';
import { I18N } from '../../../shared/i18n/i18n';

const NAME_MAX_LENGTH = 50;
const DELETE_ANIMATION_MS = 220;

@Component({
    imports: [ReactiveFormsModule, ConfirmDialogComponent, PluralPipe],
    selector: 'app-list-gym',
    styleUrl: './list-gym.component.scss',
    templateUrl: './list-gym.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListGymComponent {

    private readonly gymService = inject(GymService);
    private readonly alertService = inject(AlertService);

    protected readonly i18n = I18N.viewProfile.listGym;

    protected readonly gyms = signal<Gym[]>([]);
    protected readonly loading = signal(true);
    protected readonly skeletonCards = Array.from({ length: 3 });

    protected readonly formOpen = signal(false);
    protected readonly editingGym = signal<Gym | null>(null);
    protected readonly formTitle = computed(() => this.editingGym() ? this.i18n.renameTitle : this.i18n.addTitle);
    protected readonly submitLabel = computed(() => this.editingGym() ? this.i18n.saveLabel : this.i18n.addLabel);

    protected readonly pendingDeletion = signal<Gym | null>(null);
    protected readonly deleteConfirmMessage = computed(() => {
        const gym = this.pendingDeletion();
        return gym ? this.i18n.deleteConfirmMessage(gym.name!) : '';
    });

    protected readonly removingGymId = signal<number | null>(null);

    protected readonly formGroup = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(NAME_MAX_LENGTH)])
    });

    constructor() {
        effect(() => this.loadGyms());
    }

    protected openAddForm() {
        this.editingGym.set(null);
        this.formGroup.reset({ name: '' });
        this.formOpen.set(true);
    }

    protected openRenameForm(gym: Gym) {
        this.editingGym.set(gym);
        this.formGroup.setValue({ name: gym.name! });
        this.formOpen.set(true);
    }

    protected closeForm() {
        this.formOpen.set(false);
    }

    protected submitForm() {
        const name = (this.formGroup.value.name ?? '').trim();
        if (!name) {
            return;
        }

        const editingGym = this.editingGym();
        if (editingGym) {
            this.renameGym(editingGym, name);
        } else {
            this.createGym(name);
        }
    }

    protected openDeleteConfirm(gym: Gym) {
        this.pendingDeletion.set(gym);
    }

    protected cancelDelete() {
        this.pendingDeletion.set(null);
    }

    protected confirmDelete() {
        const gym = this.pendingDeletion();
        this.pendingDeletion.set(null);
        if (!gym) {
            return;
        }

        this.gymService.delete(gym.id)
            .subscribe({
                next: () => {
                    this.removingGymId.set(gym.id);
                    setTimeout(() => {
                        this.gyms.update(gyms => gyms.filter(g => g.id !== gym.id));
                        this.removingGymId.set(null);
                    }, DELETE_ANIMATION_MS);

                    this.alertService.show({
                        severity: 'success',
                        message: this.i18n.deleteSuccess
                    });
                },
                error: (err: CustomError) => {
                    this.alertService.show({
                        severity: 'error',
                        message: getErrorMessage(err, this.i18n.deleteError)
                    });
                }
            });
    }

    private loadGyms() {
        this.gymService.findAll()
            .subscribe({
                next: (gyms) => {
                    this.gyms.set(gyms);
                    this.loading.set(false);
                },
                error: (err: CustomError) => {
                    this.loading.set(false);
                    this.alertService.show({
                        severity: 'error',
                        message: getErrorMessage(err, this.i18n.loadError)
                    });
                }
            });
    }

    private createGym(name: string) {
        this.gymService.create(name)
            .subscribe({
                next: (gym) => {
                    this.gyms.update(gyms => [...gyms, gym]);
                    this.formOpen.set(false);
                    this.alertService.show({
                        severity: 'success',
                        message: this.i18n.createSuccess
                    });
                },
                error: (err: CustomError) => {
                    if (getErrorCode(err) === 'DUPLICATE_GYM') {
                        this.formGroup.controls.name.setErrors({ duplicateGym: true });
                    } else {
                        this.alertService.show({
                            severity: 'error',
                            message: getErrorMessage(err, this.i18n.createError)
                        });
                    }
                }
            });
    }

    private renameGym(gym: Gym, name: string) {
        this.gymService.update(gym.id, name)
            .subscribe({
                next: (updatedGym) => {
                    this.gyms.update(gyms => gyms.map(g => g.id === updatedGym.id ? updatedGym : g));
                    this.formOpen.set(false);
                    this.alertService.show({
                        severity: 'success',
                        message: this.i18n.renameSuccess
                    });
                },
                error: (err: CustomError) => {
                    this.alertService.show({
                        severity: 'error',
                        message: getErrorMessage(err, this.i18n.renameError)
                    });
                }
            });
    }
}
