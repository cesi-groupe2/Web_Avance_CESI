import React from 'react';
import styled from 'styled-components';
import { FiUpload } from 'react-icons/fi';

const ImageUploadContainer = styled.div`
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary-color);
    background-color: rgba(0, 160, 130, 0.05);
  }
`;

const UploadIcon = styled(FiUpload)`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  margin-top: 1rem;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImageUpload = ({ previewImage, onImageChange }) => {
  return (
    <>
      <ImageUploadContainer onClick={() => document.getElementById('picture').click()}>
        {previewImage ? (
          <PreviewImage src={previewImage} alt="Aperçu" />
        ) : (
          <>
            <UploadIcon />
            <p>Cliquez pour ajouter une photo</p>
            <small>JPG, PNG (max 5MB)</small>
          </>
        )}
      </ImageUploadContainer>
      <HiddenInput
        type="file"
        id="picture"
        accept="image/*"
        onChange={onImageChange}
      />
    </>
  );
};

export default ImageUpload; 