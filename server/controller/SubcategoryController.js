import SubCategory from "../models/Subcategory.js";


export const createSubCategory = async (req, res) => {

    try {

        console.log(req.body)
        const subCategory = new SubCategory(req.body);

        if (!subCategory) {
            return res.status(400)
                .json({ message: "There's nothing to save" });
        }

        await subCategory.save();

        return res.status(200)
            .json({ message: "Sub Category saved Successfully" });

    } catch (error) {
        return res.status(500)
            .json({ message: `Internale Server error: ${error}` })
    }

}

export const getAllSubcategories = async (req, res) => {
    try {
        return res.status(200).json(await SubCategory.find());
    } catch (err) {
        console.error('Error fetching categories:', err);
        return res.status(500).json({ message: 'An error occurred while processing your request' });
    }
};

export const getAllSubcategoriesByCategoryId = async (req, res) => {
    try {
        return res.status(200).json(await SubCategory.find({ category: req.params.category }));
    } catch (err) {
        console.error('Error fetching categories:', err);
        return res.status(500).json({ message: 'An error occurred while processing your request' });
    }
}


export const updateSubcategoryById = async (req, res) => {

    const { id } = req.params;
    const updateData = req.body;

    try {
        const category = await SubCategory.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({ data: category });

    } catch (error) {
        console.error(error);
        return res.status(500)
            .json({ message: 'Internal server error', error });
    }
}

export const deleteSubcategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByIdAndDelete(id, { new: true });

        return res.status(200).json({ data: category });

    } catch (error) {
        console.error(error);
        return res.status(500)
            .json({ message: 'Internal server error', error });
    }
}