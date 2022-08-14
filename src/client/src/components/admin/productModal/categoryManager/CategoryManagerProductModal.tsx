import React, { useEffect, useRef, useState } from "react";
import { useAppSelector, windowSelector } from "../../../../redux";
import "./categ-mng.styles.scss";
import RectangleInput from "../../../ui/admin/rectangleInput/RectangleInput";
import { useAdminApi } from "../../../../hooks/useAdminApi";
import { Category } from "../../../../types/types";
import { BsFillArrowUpCircleFill, BsFillArrowDownCircleFill } from "react-icons/bs";

interface CategoryManagerFormValues {
   createName: string;
   deleteName: string;
}

const CategoryManagerProductModal = () => {
   const { admin } = useAppSelector(windowSelector);
   const [formValues, setFormValues] = useState<CategoryManagerFormValues>(Object.assign({}, null));
   const { getAvailableCategories, rankUp, rankDown, createCategory, deleteCategory } = useAdminApi();

   const [categs, setCategs] = useState<Category[]>([]);
   const ulref = useRef<HTMLUListElement>(null);

   async function fetchCategoriesAsync() {
      const fetchedCategs = await getAvailableCategories();
      setCategs(fetchedCategs);
   }
   function animate() {
      if (ulref.current) {
         ulref.current.classList.remove("animate");
         setTimeout(() => {
            ulref.current.classList.add("animate");
         }, 0);
      }
   }

   useEffect(() => {
      if (ulref.current) {
         fetchCategoriesAsync();
         animate();
      }
   }, [ulref]);

   useEffect(() => {
      if (!admin.categoryManager) {
         setFormDefaults();
      }
   }, [admin.categoryManager]);

   async function handleRankDown(name: string) {
      const updCategs = await rankDown(name);
      setCategs(updCategs);
      animate();
   }
   async function handleRankUp(name: string) {
      const updCategs = await rankUp(name);
      setCategs(updCategs);
      animate();
   }

   function setFormDefaults() {
      setFormValues((state: CategoryManagerFormValues) => {
         const copy = Object.assign({}, state);
         copy.createName = "";
         copy.deleteName = "";
         return { ...copy };
      });
   }

   async function handleCreateCategory() {
      const updCategs = await createCategory(formValues.createName);
      setCategs(updCategs);
      setFormDefaults();
      animate();
   }

   async function handleDeleteCategory() {
      const updCategs = await deleteCategory(formValues.deleteName);
      setCategs(updCategs);
      setFormDefaults();
      animate();
   }

   return (
      <div className={admin.categoryManager ? "category_manager product_modal --product-modal-active" : "category_manager product_modal"}>
         <p className="product_modal_name">Управление категориями</p>
         <div className="manager_content">
            <section>
               <div className="create_remove">
                  <p className="create_remove_title">Добавить новую категорию</p>
                  <span>
                     <p>Название</p>
                     <RectangleInput
                        placeholder={"Пицца"}
                        value={formValues.createName}
                        setValue={setFormValues}
                        disabled={false}
                        name={"createName"}
                     />
                  </span>
                  <button onClick={handleCreateCategory} className="mp_control end bot save --green-normal">
                     Добавить
                  </button>
               </div>
               <div className="create_remove">
                  <p className="create_remove_title">Удалить категорию</p>
                  <span>
                     <p>Название</p>
                     <RectangleInput
                        placeholder={"Суши"}
                        value={formValues.deleteName}
                        setValue={setFormValues}
                        disabled={false}
                        name={"deleteName"}
                     />
                  </span>
                  <button onClick={handleDeleteCategory} className="mp_control end bot save --red">
                     Удалить
                  </button>
               </div>
            </section>
            <section className="ranking">
               <p className="create_remove_title">Изменить сортировку</p>
               <ul className="ranking_list animate" ref={ulref}>
                  {categs?.map((categ, i, arr) => (
                     <li className="categ_rank_item">
                        <div className="rank_item_left">
                           <p>{categ.name}</p>
                        </div>
                        <div className="rank_item_right">
                           <div className="arrows">
                              {i !== arr.length - 1 && (
                                 <BsFillArrowDownCircleFill
                                    className={i === 0 || i === arr.length - 1 ? "arrow_down --no-arrow-margin" : "arrow_down"}
                                    size={32}
                                    onClick={() => handleRankDown(categ.name)}
                                 />
                              )}
                              {i !== 0 && <BsFillArrowUpCircleFill onClick={() => handleRankUp(categ.name)} className="arrow_up" size={32} />}
                           </div>
                        </div>
                     </li>
                  ))}
               </ul>
            </section>
         </div>
      </div>
   );
};

export default CategoryManagerProductModal;
