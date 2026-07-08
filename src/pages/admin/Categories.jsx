import { useEffect, useState } from "react";

import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/layout/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import DeleteDialog from "@/components/common/DeleteDialog";

import CategoriesTable from "@/components/categories/CategoriesTable";
import NewCategoryDialog from "@/components/categories/NewCategoryDialog";
import EditCategoryDialog from "@/components/categories/EditCategoryDialog";

import {
  getCategories,
  deleteCategory,
} from "@/services/categoryService";

export default function Categories() {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {

    setLoading(true);

    try {

      const data = await getCategories();

      setCategories(data);

    } catch (error) {

      console.error(error);

    }

    setLoading(false);

  }

  function handleEdit(category) {

    setSelectedCategory(category);

    setEditOpen(true);

  }

  function handleDelete(category) {

    setSelectedCategory(category);

    setDeleteOpen(true);

  }

  async function confirmDelete() {

    if (!selectedCategory) return;

    await deleteCategory(selectedCategory.id);

    setDeleteOpen(false);

    setSelectedCategory(null);

    loadCategories();

  }

  const filtered = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <AdminLayout>

      <PageHeader
        title="Categorías"
        description="Gestiona las categorías del torneo"
        action={
          <NewCategoryDialog
            onCreated={loadCategories}
          />
        }
      />

      <div className="mb-6">

        <SearchBar
          placeholder="Buscar categoría..."
          value={search}
          onChange={setSearch}
        />

      </div>

      {

        loading ?

          (

            <div className="py-16 text-center">

              Cargando categorías...

            </div>

          )

          :

          (

            <CategoriesTable
              categories={filtered}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />

          )

      }

      <EditCategoryDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        category={selectedCategory}
        onUpdated={loadCategories}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Eliminar categoría"
        description={`¿Seguro que deseas eliminar "${selectedCategory?.name}"?`}
        onConfirm={confirmDelete}
      />

    </AdminLayout>

  );

}