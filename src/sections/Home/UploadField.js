import React, { useCallback, useEffect, useState } from 'react';
import { UploadMultiFile } from '../../components/upload';
import RHFUpload from '../../components/hook-form/RHFUpload';
import uuidv4 from '../../utils/uuidv4';

const UploadField = ({ name, setFormValue, getValues }) => {
  const [preview, setPreview] = useState(false);

  const [files, setFiles] = useState(getValues()?.files || []);

  useEffect(() => {
    setFormValue(name, files, { shouldValidate: true });
  }, [files]);
  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles((pervious) => {
        return [
          ...pervious,
          ...acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          ),
        ];
      });
    },
    [setFiles]
  );

  const handleRemoveAll = () => {
    setFiles([]);
  };

  const handleRemove = (file) => {
    const filteredItems = files.filter((_file) => _file !== file);
    setFiles(filteredItems);
  };
  return (
    <RHFUpload
      name={name}
      showPreview={preview}
      files={files}
      onDrop={handleDropMultiFile}
      onRemove={handleRemove}
      onRemoveAll={handleRemoveAll}
    />
  );
};

export default UploadField;
