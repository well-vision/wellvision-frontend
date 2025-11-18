import React, { useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Header from "../../components/Header";
import {
  useGetProductsQuery,
  useCreateProductMutation,
} from "../../state/api";
import "../../../components/Products.css";

const Product = ({
  _id,
  name,
  description,
  price,
  rating,
  category,
  supply,
  stat,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[700]}
          gutterBottom
        >
          {category || 'Uncategorized'}
        </Typography>
        <Typography variant="h5" component="div">
          {name || 'Unnamed Product'}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          ${Number(price || 0).toFixed(2)}
        </Typography>
        <Rating value={rating || 0} readOnly />

        <Typography variant="body2">{description || 'No description available'}</Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          See More
        </Button>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{
          color: theme.palette.neutral[300],
        }}
      >
        <CardContent>
          <Typography>id: {_id}</Typography>
          <Typography>Supply Left: {supply || 0}</Typography>
          <Typography>
            Yearly Sales This Year: ${stat?.yearlySalesTotal || 0}
          </Typography>
          <Typography>
            Yearly Units Sold This Year: {stat?.yearlyTotalSoldUnits || 0}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

const Products = () => {
  const { data, isLoading, error } = useGetProductsQuery();
  const theme = useTheme();
  const [createProduct, { isLoading: isCreating }] =
    useCreateProductMutation();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Match the old detailed product form options
  const categories = [
    { value: "eyeglasses", label: "Eyeglasses" },
    { value: "sunglasses", label: "Sunglasses" },
    { value: "contact-lenses", label: "Contact Lenses" },
    { value: "lens", label: "Lenses" },
    { value: "accessories", label: "Accessories" },
  ];

  const brands = [
    { value: "ray-ban", label: "Ray-Ban" },
    { value: "oakley", label: "Oakley" },
    { value: "gucci", label: "Gucci" },
    { value: "prada", label: "Prada" },
    { value: "versace", label: "Versace" },
    { value: "tom-ford", label: "Tom Ford" },
    { value: "other", label: "Other" },
  ];

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "eyeglasses",
    brand: "",
    model: "",
    price: "",
    cost: "",
    stock: "",
    reorderLevel: "",
    description: "",
    frameMaterial: "",
    frameColor: "",
    lensType: "",
    prescription: false,
  });

  const handleOpenCreate = () => setIsCreateOpen(true);
  const handleCloseCreate = () => setIsCreateOpen(false);

  const handleCreateChange = (field) => (event) => {
    const { value, type, checked } = event.target;
    setNewProduct((prev) => ({
      ...prev,
      [field]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        name: newProduct.name.trim(),
        category: newProduct.category,
        brand: newProduct.brand,
        model: newProduct.model,
        price: Number(newProduct.price) || 0,
        cost:
          newProduct.cost === "" ? 0 : Number(newProduct.cost) || 0,
        stock:
          newProduct.stock === "" ? 0 : Number(newProduct.stock) || 0,
        reorderLevel:
          newProduct.reorderLevel === ""
            ? 0
            : Number(newProduct.reorderLevel) || 0,
        description: newProduct.description.trim(),
        frameMaterial: newProduct.frameMaterial.trim(),
        frameColor: newProduct.frameColor.trim(),
        lensType: newProduct.lensType.trim(),
        prescription: newProduct.prescription,
      };

      await createProduct(payload).unwrap();

      setNewProduct({
        name: "",
        category: "eyeglasses",
        brand: "",
        model: "",
        price: "",
        cost: "",
        stock: "",
        reorderLevel: "",
        description: "",
        frameMaterial: "",
        frameColor: "",
        lensType: "",
        prescription: false,
      });
      setIsCreateOpen(false);
    } catch (err) {
      console.error("Failed to create product:", err);
      alert("Failed to create product. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <Box m="1.5rem 2.5rem">
        <Header title="PRODUCTS" subtitle="See your list of products." />
        <Typography variant="h6" sx={{ mt: "20px" }}>
          Loading products...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="1.5rem 2.5rem">
        <Header title="PRODUCTS" subtitle="See your list of products." />
        <Typography variant="h6" color="error" sx={{ mt: "20px" }}>
          Error loading products: {error.message || 'Unknown error'}
        </Typography>
      </Box>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Box m="1.5rem 2.5rem">
        <Header title="PRODUCTS" subtitle="See your list of products." />
        <Typography variant="h6" sx={{ mt: "20px" }}>
          No products available
        </Typography>
      </Box>
    );
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PRODUCTS" subtitle="See your list of products." />
      <Box mt="20px" display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={handleOpenCreate}
          sx={{
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.background.alt,
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          Add Product
        </Button>
      </Box>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        justifyContent="space-between"
        rowGap="20px"
        columnGap="1.33%"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        {data.map(
          ({
            _id,
            name,
            description,
            price,
            rating,
            category,
            supply,
            stat,
          }) => (
            <Product
              key={_id}
              _id={_id}
              name={name}
              description={description}
              price={price}
              rating={rating}
              category={category}
              supply={supply}
              stat={stat}
            />
          )
        )}
      </Box>
      {isCreateOpen && (
        <div className="modal-overlay" onClick={handleCloseCreate}>
          <div
            className="modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">Add New Product</h3>
              <button
                type="button"
                className="modal-close"
                onClick={handleCloseCreate}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">
                    Product Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    name="name"
                    value={newProduct.name}
                    onChange={handleCreateChange("name")}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Category <span className="required">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="category"
                      value={newProduct.category}
                      onChange={handleCreateChange("category")}
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Brand <span className="required">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="brand"
                      value={newProduct.brand}
                      onChange={handleCreateChange("brand")}
                      required
                    >
                      <option value="">Select Brand</option>
                      {brands.map((brand) => (
                        <option key={brand.value} value={brand.value}>
                          {brand.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Model Number</label>
                  <input
                    type="text"
                    className="form-input"
                    name="model"
                    value={newProduct.model}
                    onChange={handleCreateChange("model")}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Selling Price (Rs.) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      name="price"
                      value={newProduct.price}
                      onChange={handleCreateChange("price")}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Cost Price (Rs.) <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      name="cost"
                      value={newProduct.cost}
                      onChange={handleCreateChange("cost")}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Stock Quantity <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      name="stock"
                      value={newProduct.stock}
                      onChange={handleCreateChange("stock")}
                      min="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Reorder Level</label>
                    <input
                      type="number"
                      className="form-input"
                      name="reorderLevel"
                      value={newProduct.reorderLevel}
                      onChange={handleCreateChange("reorderLevel")}
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Frame Material</label>
                    <input
                      type="text"
                      className="form-input"
                      name="frameMaterial"
                      value={newProduct.frameMaterial}
                      onChange={handleCreateChange("frameMaterial")}
                      placeholder="e.g., Metal, Plastic, Acetate"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Frame Color</label>
                    <input
                      type="text"
                      className="form-input"
                      name="frameColor"
                      value={newProduct.frameColor}
                      onChange={handleCreateChange("frameColor")}
                      placeholder="e.g., Black, Gold, Tortoise"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Lens Type</label>
                  <input
                    type="text"
                    className="form-input"
                    name="lensType"
                    value={newProduct.lensType}
                    onChange={handleCreateChange("lensType")}
                    placeholder="e.g., Clear, Polarized, Blue Light Filter"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    name="description"
                    value={newProduct.description}
                    onChange={handleCreateChange("description")}
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="prescription"
                      checked={newProduct.prescription}
                      onChange={handleCreateChange("prescription")}
                    />
                    <span className="form-label" style={{ margin: 0 }}>
                      Prescription Available
                    </span>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-btn modal-btn-cancel"
                  onClick={handleCloseCreate}
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-btn modal-btn-submit"
                  disabled={isCreating}
                >
                  {isCreating ? "Saving..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Box>
  );
};

export default Products;
