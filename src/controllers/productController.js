import ProductDAO from "../dao/productDao.js";

export const getProduct = async (req, res) => {
    try {
        const products = await ProductDAO.getAll();

        if (!products) {
            return res.status(404).json({ status: "error", message: "Productos no encontrados" });
        }

        res.status(200).json({ status: "success", message: "Productos obtenidos correctamente", products });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await ProductDAO.getById(pid);

        if (!product) {
            return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        }

        res.status(200).json({ status: "success", message: "Producto obtenido correctamente", product });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { title, description, price, stock, category } = req.body;
        const product = await ProductDAO.create({ title, description, price, stock, category });

        if (!product) {
            return res.status(400).json({ status: "error", message: "Error al crear el producto" });
        }

        res.status(200).json({ status: "success", message: "Producto creado correctamente", product });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const { title, description, price, stock, category } = req.body;
        const product = await ProductDAO.update(pid, { title, description, price, stock, category });

        if (!product) {
            return res.status(404).json({ status: "error", message: "Error al actualizar el producto" });
        }

        res.status(200).json({ status: "success", message: "Producto actualizado correctamente", product });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await ProductDAO.delete(pid);

        if (!product) {
            return res.status(404).json({ status: "error", message: "Error al eliminar el producto" });
        }
        res.status(200).json({ status: "success", message: "Producto eliminado correctamente", product });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};  