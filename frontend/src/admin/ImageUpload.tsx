import { ChangeEvent, useRef, useState } from 'react';
import api from '../api/api';

interface Props {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

const API_ORIGIN = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '');

export default function ImageUpload({ value, onChange, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(`${API_ORIGIN}${res.data.url}`);
    } catch {
      setError('Не удалось загрузить файл');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload">
      {label && <label className="image-upload__label">{label}</label>}

      {value ? (
        <div className="image-upload__preview">
          <img src={value} alt="preview" />
          <button type="button" className="image-upload__remove" onClick={() => onChange('')}>
            Удалить
          </button>
        </div>
      ) : (
        <label className="image-upload__dropzone">
          {uploading ? 'Загрузка...' : '+ Загрузить изображение'}
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} hidden />
        </label>
      )}

      {error && <small className="image-upload__error">{error}</small>}
    </div>
  );
}
