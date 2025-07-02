import GetAllToursUseCase from "@/application/usecases/GetAllToursUseCase";
import Categories from "@/components/categories/Categories";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import TourRepo from "@/infraestructure/implementation/httpRequest/axios/TourRepo";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [tours, setTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const isOnline = useOnlineStatus();

  const toursRepo = new TourRepo();
  const getAllToursUseCase = new GetAllToursUseCase(toursRepo);

  /**
   * Carga los datos de tours desde localStorage.
   * @returns {boolean} True si se cargaron datos, false en caso contrario o error.
   */
  const loadToursFromLocalStorage = () => {
    try {
      const cachedProducts = localStorage.getItem("products");
      if (cachedProducts) {
        const parsedProducts = JSON.parse(cachedProducts);
        if (Array.isArray(parsedProducts)) {
          setTours(parsedProducts);
          console.log("[Home] 🟢 Datos cargados desde localStorage.");
          return true;
        } else {
          console.warn("[Home] 🟡 Datos en localStorage no son un array válido.");
        }
      }
    } catch (error) {
      console.error("[Home] ❌ Error al cargar o parsear del localStorage:", error);
    }
    console.log("[Home] 🔵 No se encontraron datos válidos en localStorage.");
    return false; 
  };

  /**
   * Obtiene los datos frescos de la API y los guarda en localStorage.
   * Esta función será interceptada por el Service Worker si está activo y online.
   * @returns {boolean} True si se obtuvieron y guardaron datos frescos, false en caso contrario.
   */
  const fetchAndCacheTours = async () => {
    console.log("[Home] 🚀 Intentando obtener datos frescos de la API...");
    try {
      const response = await getAllToursUseCase.run();
      if (response && Array.isArray(response)) {
        setTours(response); 
        localStorage.setItem("products", JSON.stringify(response)); 
        console.log("[Home] ✅ Datos frescos obtenidos de la API y guardados en localStorage.");
        return true; 
      } else {
        console.warn("[Home] ⚠️ La respuesta de la API no es un array válido o está vacía.");
      }
    } catch (error) {
      console.error("[Home] ❌ Error al obtener datos de la API (o Service Worker falló):", error);
    }
    return false; 
  };

  useEffect(() => {
    const initializeData = async () => {
      console.log("--- [Home] Iniciando carga de datos ---");
      console.log("[Home] Estado de conexión: ", isOnline ? "ONLINE" : "OFFLINE");

      const loadedFromCache = loadToursFromLocalStorage();
      console.log("[Home] ¿Cargado desde localStorage al inicio?", loadedFromCache);

      if (isOnline) {
        console.log("[Home] Estamos ONLINE. Intentando obtener/refrescar datos de la API...");
        const fetchedOnline = await fetchAndCacheTours(); 

        if (!fetchedOnline && !loadedFromCache) {
          console.warn("[Home] ⚠️ ONLINE: No se pudieron obtener datos de la API y no había datos en localStorage. Vaciando tours.");
          setTours([]);
        } else if (fetchedOnline) {
            console.log("[Home] ✅ ONLINE: Datos frescos obtenidos y mostrados.");
        } else if (loadedFromCache) {
            console.log("[Home] ℹ️ ONLINE: No se obtuvieron datos frescos, pero se mostraron los de localStorage.");
        }

      } else {
        console.log("[Home] Estamos OFFLINE.");
        if (!loadedFromCache) {
          console.warn("[Home] ⚠️ OFFLINE: No se pudo cargar datos del localStorage. Vaciando tours.");
          setTours([]);
        } else {
          console.log("[Home] ✅ OFFLINE: Datos cargados exitosamente del localStorage y mostrados.");
        }
      }
      console.log("--- [Home] Finalizada carga de datos ---");
    };

    initializeData();
  }, [isOnline]); 
  
  return (
    <section>
      <div className="container-main">
        <h1 className="title text-light">Servicios</h1>
        <span>Embárcate en una experiencia única y descubre Huatulco desde otra perspectiva.</span>
      </div>
      <div className="container-section">
        {!isOnline && (
          <div className="alert alert-warning" role="alert">
            Estás en modo offline. Algunos datos pueden no estar actualizados.
          </div>
        )}
        {/* Asegúrate de pasar 'tours' a 'Categories' si los necesita para filtrar o mostrar */}
        <Categories tours={tours} searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> 
      </div>
    </section>
  );
}