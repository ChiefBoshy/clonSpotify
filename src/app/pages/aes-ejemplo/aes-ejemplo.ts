import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  imports: [FormsModule,CommonModule],
  selector: 'app-aes-ejemplo',
  styleUrl: './aes-ejemplo.scss',
  templateUrl: './aes-ejemplo.html',
})
export class AesEjemplo {

  texto = '';
  textoCifrado = '';
  mensaje = '';

   private readonly clave = environment.aesKey;

  // _usar promesa para crypto async
  private async obtenerClave(): Promise<CryptoKey> {
  const rawKey = new TextEncoder().encode(environment.aesKey);

  return crypto.subtle.importKey(
    'raw',
    rawKey,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

  async cifrar(): Promise<void> {
    try {
      if (!this.texto) {
        this.mensaje = 'Escribe un texto para cifrar.';
        return;
      }

      const clave = await this.obtenerClave();
      const iv = crypto.getRandomValues(new Uint8Array(12));

      const resultado = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        clave,
        new TextEncoder().encode(this.texto)
      );

      const bytes = new Uint8Array(12 + resultado.byteLength);
      bytes.set(iv, 0);
      bytes.set(new Uint8Array(resultado), 12);

      this.textoCifrado = btoa(
        Array.from(bytes, b => String.fromCharCode(b)).join('')
      );

      this.mensaje = 'Texto cifrado correctamente.';
    } catch {
      this.mensaje = 'Error al cifrar el texto.';
    }
  }

  async descifrar(): Promise<void> {
    try {
      if (!this.textoCifrado) {
        this.mensaje = 'Introduce el texto cifrado.';
        return;
      }

      const bytes = Uint8Array.from(
        atob(this.textoCifrado),
        c => c.charCodeAt(0)
      );

      if (bytes.length < 29) {
        throw new Error('Texto cifrado inválido');
      }

      const iv = bytes.slice(0, 12);
      const datos = bytes.slice(12);
      const clave = await this.obtenerClave();

      const resultado = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        clave,
        datos
      );

      this.texto = new TextDecoder().decode(resultado);
      this.mensaje = 'Texto descifrado correctamente.';
    } catch {
      this.mensaje =
        'No se pudo descifrar. Verifica el texto y la clave.';
    }
  }
}
