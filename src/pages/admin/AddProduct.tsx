import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../../services/firebaseService';
import { uploadImage } from '../../services/api';
import { categories, materials } from '../../services/firebaseService';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'rings',
    material: 'gold',
    weight: '',
    purity: '22K',
    stock: '1',
    isFeatured: false,
    isNewArrival: false,
    features: '',
    tags: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(prev => [...prev, ...files]);
      files.forEach(file => {
        const url = URL.createObjectURL(file);
        setImagePreviewUrls(prev => [...prev, url]);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!form.name || !form.price || !form.category) {
        throw new Error('Name, price, and category are required');
      }

      // Upload images first
      let uploadedUrls: string[] = [...imageUrls];
      if (images.length > 0) {
        setUploadingImages(true);
        for (const file of images) {
          const result = await uploadImage(file, 'porwal-jewellers/products');
          uploadedUrls.push(result.url);
        }
        setUploadingImages(false);
      }

      // Create product
      await addProduct({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        category: form.category,
        material: form.material,
        weight: form.weight || null,
        purity: form.purity,
        images: uploadedUrls,
        stock: Number(form.stock),
        features: form.features ? form.features.split(',').map(f => f.trim()).filter(Boolean) : [],
        isFeatured: form.isFeatured,
        isNewArrival: form.isNewArrival,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      });

      setSuccess('Product added successfully!');
      // Reset form
      setForm({
        name: '', description: '', price: '', originalPrice: '',
        category: 'rings', material: 'gold', weight: '', purity: '22K',
        stock: '1', isFeatured: false, isNewArrival: false,
        features: '', tags: '',
      });
      setImages([]);
      setImageUrls([]);
      setImagePreviewUrls([]);

      setTimeout(() => navigate('/admin/manage-products'), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to add product');
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  return (
    <div className="admin-form-page">
      <div className="admin-header">
        <h1>Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {error && <div className="error-message">⚠️ {error}</div>}
        {success && <div className="success-message">✓ {success}</div>}

        <div className="form-grid">
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Gold Mangalsutra with Diamond"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Product description..."
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 50000"
                  required
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Original Price (₹)</label>
                <input
                  type="number"
                  value={form.originalPrice}
                  onChange={e => setForm({ ...form, originalPrice: e.target.value })}
                  placeholder="For showing discount"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Classification</h2>

            <div className="form-group">
              <label>Category *</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Material *</label>
              <select
                value={form.material}
                onChange={e => setForm({ ...form, material: e.target.value })}
                required
              >
                {materials.map(mat => (
                  <option key={mat} value={mat}>
                    {mat.charAt(0).toUpperCase() + mat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Purity</label>
                <select
                  value={form.purity}
                  onChange={e => setForm({ ...form, purity: e.target.value })}
                >
                  {['24K', '22K', '18K', '14K', '916', '750', '585'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Weight (grams)</label>
                <input
                  type="text"
                  value={form.weight}
                  onChange={e => setForm({ ...form, weight: e.target.value })}
                  placeholder="e.g. 10.5"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })}
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Images</h2>
          <div className="image-upload-area">
            <div className="image-previews">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="image-preview">
                  <img src={url} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className="image-upload-btn">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  hidden
                />
                <span>+ Add Image</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-section">
            <h2>Additional Info</h2>

            <div className="form-group">
              <label>Features (comma separated)</label>
              <input
                type="text"
                value={form.features}
                onChange={e => setForm({ ...form, features: e.target.value })}
                placeholder="e.g. Hallmarked, Diamond Certified, Gift Box Included"
              />
            </div>

            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={e => setForm({ ...form, tags: e.target.value })}
                placeholder="e.g. wedding, gift, trending"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Status</h2>

            <div className="toggle-group">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                />
                <span className="toggle-text">Featured Product</span>
                <span className="toggle-hint">Show on homepage featured section</span>
              </label>

              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={form.isNewArrival}
                  onChange={e => setForm({ ...form, isNewArrival: e.target.checked })}
                />
                <span className="toggle-text">New Arrival</span>
                <span className="toggle-hint">Mark as new arrival</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/admin/manage-products')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading || uploadingImages}
          >
            {uploadingImages
              ? 'Uploading Images...'
              : loading
                ? 'Adding Product...'
                : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
