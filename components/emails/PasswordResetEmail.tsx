import React from 'react';

interface PasswordResetEmailProps {
  resetLink: string;
  userName?: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  resetLink,
  userName,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
      <h1 style={{ color: '#7BB32E', margin: '0' }}>NaturaJM</h1>
    </div>
    <div style={{ padding: '40px 20px', backgroundColor: '#ffffff', border: '1px solid #e9ecef' }}>
      <h2 style={{ color: '#333333', marginTop: '0' }}>Recuperación de Contraseña</h2>
      <p style={{ color: '#555555', fontSize: '16px', lineHeight: '1.5' }}>
        Hola {userName || 'Cliente'},
      </p>
      <p style={{ color: '#555555', fontSize: '16px', lineHeight: '1.5' }}>
        Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en NaturaJM.
        Si no fuiste tú, puedes ignorar este correo.
      </p>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <a
          href={resetLink}
          style={{
            backgroundColor: '#7BB32E',
            color: '#ffffff',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          Restablecer Contraseña
        </a>
      </div>
      <p style={{ color: '#999999', fontSize: '14px' }}>
        Este enlace expirará en 1 hora.
      </p>
    </div>
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f8f9fa', color: '#999999', fontSize: '12px' }}>
      &copy; {new Date().getFullYear()} NaturaJM Elite Business. Todos los derechos reservados.
    </div>
  </div>
);
