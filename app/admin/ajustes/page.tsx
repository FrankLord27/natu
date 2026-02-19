'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Save, Globe, MessageCircle, Mail, Instagram, Facebook, Layout, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Page = styled.div`
  max-width: 1000px; margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 40px;
  h1 { font-size: 2.2rem; font-weight: 900; color: #1a1a1a; margin-bottom: 10px; }
  p { color: #666; font-weight: 600; }
`;

const Section = styled.div`
  background: white; border-radius: 24px; padding: 35px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f0f0f0;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  display: flex; align-items: center; gap: 12px;
  font-size: 1.2rem; font-weight: 800; color: #1a1a1a; margin-bottom: 25px;
  svg { color: ${p => p.theme.colors.primary}; }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  &:last-child { margin-bottom: 0; }
`;

const Label = styled.label`
  display: block; font-size: 0.85rem; font-weight: 800; color: #888;
  margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%; padding: 14px 18px; border: 2px solid #f0f0f0; border-radius: 14px;
  font-size: 1rem; color: #333; font-weight: 600; transition: all 0.2s;
  &:focus { border-color: ${p => p.theme.colors.primary}; outline: none; }
`;

const Grid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const FloatingBar = styled(motion.div)`
  position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
  background: #1a1a1a; padding: 15px 30px; border-radius: 20px;
  display: flex; align-items: center; gap: 20px; color: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2); z-index: 2000;
`;

const SaveBtn = styled.button`
  background: ${p => p.theme.colors.primary}; color: white; border: none;
  padding: 10px 25px; border-radius: 12px; font-weight: 800; cursor: pointer;
  display: flex; align-items: center; gap: 8px; transition: all 0.2s;
  &:hover { filter: brightness(1.1); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export default function AdminAjustes() {
  const [settings, setSettings] = useState({
    siteName: 'NaturaJM',
    siteUrl: 'https://naturajm.com',
    whatsapp: '18091234567',
    contactEmail: 'info@naturajm.com',
    instagram: '@naturajm',
    facebook: 'NaturaJM Oficial',
    deliveryFee: 200,
    minOrderFree: 2500,
    maintenanceMode: false
  });

  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulación de guardado (se integrará con SiteContent API)
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setHasChanges(false);
    alert('Ajustes guardados exitosamente 🚀');
  };

  return (
    <Page>
      <Header>
        <h1>Configuración de la Plataforma</h1>
        <p>Control global de la marca, redes sociales y logística.</p>
      </Header>

      <Section>
        <SectionTitle><Globe size={20} /> Identidad de Marca</SectionTitle>
        <Grid>
          <FormGroup>
            <Label>Nombre del Sitio</Label>
            <Input value={settings.siteName} onChange={e => handleChange('siteName', e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label>URL Oficial</Label>
            <Input value={settings.siteUrl} onChange={e => handleChange('siteUrl', e.target.value)} />
          </FormGroup>
        </Grid>
      </Section>

      <Section>
        <SectionTitle><MessageCircle size={20} /> Canales de Contacto</SectionTitle>
        <Grid>
          <FormGroup>
            <Label>MessageCircle (Internacional)</Label>
            <Input value={settings.whatsapp} onChange={e => handleChange('whatsapp', e.target.value)} placeholder="Ej: 18091234567" />
          </FormGroup>
          <FormGroup>
            <Label>Email de Soporte</Label>
            <Input value={settings.contactEmail} onChange={e => handleChange('contactEmail', e.target.value)} />
          </FormGroup>
        </Grid>
      </Section>

      <Section>
        <SectionTitle><Layout size={20} /> Logística y Pagos</SectionTitle>
        <Grid>
          <FormGroup>
            <Label>Costo de Envío Estándar</Label>
            <Input type="number" value={settings.deliveryFee} onChange={e => handleChange('deliveryFee', parseFloat(e.target.value))} />
          </FormGroup>
          <FormGroup>
            <Label>Mínimo para Envío Gratis</Label>
            <Input type="number" value={settings.minOrderFree} onChange={e => handleChange('minOrderFree', parseFloat(e.target.value))} />
          </FormGroup>
        </Grid>
      </Section>

      <Section>
        <SectionTitle><Shield size={20} /> Sistema y Seguridad</SectionTitle>
        <FormGroup style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <input type="checkbox" checked={settings.maintenanceMode} onChange={e => handleChange('maintenanceMode', e.target.checked)} style={{ width: 20, height: 20 }} />
          <div>
            <Label style={{ margin: 0 }}>Modo Mantenimiento</Label>
            <p style={{ fontSize: '0.8rem', color: '#999', margin: 0 }}>Activa esto para mostrar una página de {"\""}Volvemos pronto{"\""} a los clientes.</p>
          </div>
        </FormGroup>
      </Section>

      {hasChanges && (
        <FloatingBar initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}>
          <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Tienes cambios sin guardar</span>
          <SaveBtn onClick={handleSave} disabled={saving}>
            <Save size={18} /> {saving ? 'Guardando...' : 'Guardar Cambios'}
          </SaveBtn>
        </FloatingBar>
      )}
    </Page>
  );
}
