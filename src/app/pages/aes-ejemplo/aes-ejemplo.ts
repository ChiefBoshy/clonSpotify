import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-aes-ejemplo',
  styleUrl: './aes-ejemplo.scss',
  templateUrl: './aes-ejemplo.html',
})
export class AesEjemplo {
  texto = '';
  textoCifrado = '';
  mensaje = '';

  private readonly clave = CryptoJS.enc.Utf8.parse(environment.aesKey);

  cifrar(): void {
    try {
      if (!this.texto) {
        this.mensaje = 'Escribe un texto para cifrar.';
        return;
      }

      // Genera un IV aleatorio de 16 bytes (128 bits)
      const iv = CryptoJS.lib.WordArray.random(16);

      // Cifra con AES
      const cifrado = CryptoJS.AES.encrypt(this.texto, this.clave, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Une el IV y el texto cifrado en un solo string Base64
      const combinado = iv.clone().concat(cifrado.ciphertext);
      this.textoCifrado = CryptoJS.enc.Base64.stringify(combinado);

      this.mensaje = 'Texto cifrado correctamente.';
    } catch {
      this.mensaje = 'Error al cifrar el texto.';
    }
  }

  descifrar(): void {
    try {
      if (!this.textoCifrado) {
        this.mensaje = 'Introduce el texto cifrado.';
        return;
      }

      // Decodifica el Base64 recibido
      const combinado = CryptoJS.enc.Base64.parse(this.textoCifrado);

      // Extrae los primeros 16 bytes (4 words de 32 bits) correspondientes al IV
      const iv = CryptoJS.lib.WordArray.create(combinado.words.slice(0, 4), 16);

      // Extrae el resto de bytes correspondientes al mensaje cifrado
      const ciphertext = CryptoJS.lib.WordArray.create(
        combinado.words.slice(4),
        combinado.sigBytes - 16
      );

      // Descifra
      const descifrado = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext } as CryptoJS.lib.CipherParams,
        this.clave,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      const textoPlano = descifrado.toString(CryptoJS.enc.Utf8);

      if (!textoPlano) {
        throw new Error('Texto inválido');
      }

      this.texto = textoPlano;
      this.mensaje = 'Texto descifrado correctamente.';
    } catch {
      this.mensaje = 'No se pudo descifrar. Verifica el texto y la clave.';
    }
  }
}
