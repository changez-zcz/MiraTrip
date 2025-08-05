import React, { useState, useRef } from 'react';
import { Upload, Button, message, Image, Card, Space } from 'antd';
import { 
  InboxOutlined, 
  PlusOutlined, 
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import './ImageUploader.css';

const { Dragger } = Upload;

interface ImageUploaderProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  maxCount?: number;
  maxSize?: number; // MB
  accept?: string;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = [],
  onChange,
  maxCount = 10,
  maxSize = 5,
  accept = 'image/*',
  disabled = false
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} 不是有效的图片文件`);
        return;
      }

      // 检查文件大小
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name} 文件大小超过 ${maxSize}MB 限制`);
        return;
      }

      // 检查文件数量
      if (value.length + newFiles.length >= maxCount) {
        errors.push(`最多只能上传 ${maxCount} 张图片`);
        return;
      }

      newFiles.push(file);
    });

    if (errors.length > 0) {
      errors.forEach(error => message.error(error));
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...value, ...newFiles];
      onChange?.(updatedFiles);
      
      // 更新文件列表用于预览
      const newFileList = newFiles.map((file, index) => ({
        uid: `-${Date.now()}-${index}`,
        name: file.name,
        status: 'done' as const,
        url: URL.createObjectURL(file),
        originFileObj: file
      }));
      
      setFileList(prev => [...prev, ...newFileList]);
    }
  };

  const handleRemove = (file: UploadFile) => {
    const updatedFiles = value.filter((_, index) => {
      const fileIndex = fileList.findIndex(f => f.uid === file.uid);
      return index !== fileIndex;
    });
    
    onChange?.(updatedFiles);
    
    const updatedFileList = fileList.filter(f => f.uid !== file.uid);
    setFileList(updatedFileList);
    
    // 释放URL对象
    if (file.url) {
      URL.revokeObjectURL(file.url);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    accept,
    fileList,
    beforeUpload: () => false, // 阻止自动上传
    onChange: (info) => {
      if (info.fileList.length > maxCount) {
        message.error(`最多只能上传 ${maxCount} 张图片`);
        return;
      }
      
      const files = info.fileList.map(f => f.originFileObj).filter(Boolean) as File[];
      onChange?.(files);
      setFileList(info.fileList);
    },
    onRemove: handleRemove,
    disabled
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e.target.files)}
        aria-label="选择图片文件"
      />

      {fileList.length === 0 ? (
        <Dragger
          {...uploadProps}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
          className="upload-dragger"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
          <p className="ant-upload-hint">
            支持单个或批量上传，最多 {maxCount} 张图片，单张图片不超过 {maxSize}MB
          </p>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            disabled={disabled}
          >
            选择图片
          </Button>
        </Dragger>
      ) : (
        <div className="image-preview-container">
          <div className="image-grid">
            {fileList.map((file) => (
              <Card
                key={file.uid}
                className="image-card"
                size="small"
                actions={[
                  <EyeOutlined 
                    key="view" 
                    onClick={() => {
                      if (file.url) {
                        window.open(file.url, '_blank');
                      }
                    }}
                  />,
                  <DeleteOutlined 
                    key="delete" 
                    onClick={() => handleRemove(file)}
                    style={{ color: '#ff4d4f' }}
                  />
                ]}
              >
                <div className="image-wrapper">
                  <Image
                    src={file.url}
                    alt={file.name}
                    preview={false}
                    className="preview-image"
                  />
                </div>
                <div className="image-info">
                  <div className="image-name">{file.name}</div>
                  <div className="image-size">
                    {(file.size! / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {fileList.length < maxCount && (
            <div className="add-more-container">
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={handleClick}
                disabled={disabled}
                className="add-more-button"
              >
                添加更多图片
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 