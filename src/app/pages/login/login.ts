  import { CommonModule } from '@angular/common';
  import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
  import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
  import { ActivatedRoute } from '@angular/router';
  import { UserStorage } from '../../services/user-storage';
  import { SessionStorageService } from '../../services/session-storage';
 import Swal from 'sweetalert2';


  @Component({
    imports: [ReactiveFormsModule,CommonModule],
    selector: 'app-login',
    styleUrl: './login.scss',
    templateUrl: './login.html',
  })
  export class Login implements OnInit {
    private route = inject(ActivatedRoute);
    private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  mensaje = '';
  private userStorage = inject(UserStorage);
  private sessionStorage = inject(SessionStorageService);

    tipoFormulario: string | null = 'login';
    formRegistro!: FormGroup;
    formLogin!: FormGroup;

    ngOnInit() {
      this.formRegistro = this.fb.group({
        name: ['', Validators.required],
        pwd: ['', [Validators.required, Validators.minLength(6)]],
        repassword: ['', Validators.required]
      }, { validators: this.passwordMatchValidator }); // Asignado al grupo

      this.formLogin = this.fb.group({
        name: ['', Validators.required],
        pwd: ['', Validators.required]
      });

    this.route.queryParamMap.subscribe(params => {
        const modo = params.get('modo');

        if (modo === 'register' || modo === 'login') {
          console.log(modo);
          this.tipoFormulario = modo;
          this.cdr.markForCheck();
        }
    });
      
    }

    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
      const password = control.get('pwd');
      const confirmPassword = control.get('repassword');

      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { passwordMismatch: true };
      }

      return null;
    }

  async onSubmitRegistro() {
    if (this.formRegistro.invalid) {
      this.formRegistro.markAllAsTouched();
      return;
    }

    const { name, pwd } = this.formRegistro.value;

    const registrado = this.userStorage.register(name, pwd);

    if (!registrado) {
      await Swal.fire({
        icon: 'error',
        title: 'Usuario existente',
        text: 'Ya existe un usuario con ese nombre.'
      });

      return;
    }

    this.formRegistro.reset();
    this.tipoFormulario = 'login';

    await Swal.fire({
      icon: 'success',
      title: '¡Registro exitoso!',
      text: 'Tu usuario se ha registrado correctamente.',
      confirmButtonText: 'Continuar'
    });
  }

    
async onSubmitLogin() {
  if (this.formLogin.invalid) {
    this.formLogin.markAllAsTouched();
    return;
  }

  const { name, pwd } = this.formLogin.value;

  const loginExitoso = this.sessionStorage.login(name, pwd);

  if (!loginExitoso) {
    await Swal.fire({
      icon: 'error',
      title: 'Error al iniciar sesión',
      text: 'Usuario o contraseña incorrectos.',
      confirmButtonText: 'Intentar de nuevo'
    });

    return;
  }

  const sesion = this.sessionStorage.getCurrentUser();

  await Swal.fire({
    icon: 'success',
    title: '¡Bienvenido!',
    text: `Hola, ${sesion?.name}. Has iniciado sesión correctamente.`,
    confirmButtonText: 'Continuar'
  });

  console.log('Sesión iniciada:', sesion);
}

  }
