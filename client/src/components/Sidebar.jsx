// // "use client"

// // import { Link, useLocation } from "react-router-dom"
// // import {
// //   Bars3Icon,
// //   XMarkIcon,
// //   HomeIcon,
// //   CubeIcon,
// //   ShoppingCartIcon,
// //   ClipboardDocumentListIcon,
// //   ChartBarIcon,
// //   ShoppingBagIcon,
// //   UsersIcon,
// //   BuildingOfficeIcon,
// //   DocumentTextIcon,
// // } from "@heroicons/react/24/outline"

// // const Sidebar = ({ isOpen, toggleSidebar }) => {
// //   const location = useLocation()

// //   const isActive = (path) => {
// //     return location.pathname === path || location.pathname.startsWith(path + "/")
// //   }

// //   const menuItems = [
// //     { name: "Dashboard", path: "/", icon: HomeIcon },
// //     { name: "PDV", path: "/pdv", icon: ShoppingBagIcon },
// //     { name: "Produtos", path: "/products", icon: CubeIcon },
// //     { name: "Vendas", path: "/sales", icon: ShoppingCartIcon },
// //     { name: "Orçamentos", path: "/quotes", icon: DocumentTextIcon },
// //     { name: "Clientes", path: "/customers", icon: UsersIcon },
// //     { name: "Fornecedores", path: "/suppliers", icon: BuildingOfficeIcon },
// //     { name: "Despesas", path: "/expenses", icon: DocumentTextIcon },
// //     { name: "Estoque", path: "/inventory", icon: ClipboardDocumentListIcon },
// //     { name: "Relatórios", path: "/reports", icon: ChartBarIcon },
// //   ]

// //   return (
// //     <div
// //       className={`fixed inset-y-0 left-0 z-30 bg-white shadow-lg transition-all duration-300 text-black-600 hover:text-black-800 text-sm font-medium ${isOpen ? "w-64" : "w-20"}`}
// //     >
// //       <div className="flex items-center justify-between h-16 px-4 border-b">
// //         {isOpen && <h1 className="text-xl font-bold text-red-600">FgFilms</h1>}
// //         <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-100">
// //           {isOpen ? <XMarkIcon className="w-6 h-6 text-gray-500" /> : <Bars3Icon className="w-6 h-6 text-gray-500" />}
// //         </button>
// //       </div>

// //       <nav className="mt-6">
// //         <ul>
// //           {menuItems.map((item) => (
// //             <li key={item.name}>
// //               <Link
// //                 to={item.path}
// //                 className={`flex items-center px-4 py-3 ${
// //                   isActive(item.path)
// //                     ? "bg-red-50 text-red-600 border-r-4 border-red-600"
// //                     : "text-gray-600 hover:bg-gray-100"
// //                 } transition-colors`}
// //               >
// //                 <item.icon className="w-6 h-6" />
// //                 {isOpen && <span className="ml-3">{item.name}</span>}
// //               </Link>
// //             </li>
// //           ))}
// //         </ul>
// //       </nav>
// //     </div>
// //   )
// // }

// // export default Sidebar





// import React, { useMemo, useRef } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Bars3Icon,
//   XMarkIcon,
//   HomeIcon,
//   CubeIcon,
//   ShoppingCartIcon,
//   ClipboardDocumentListIcon,
//   ChartBarIcon,
//   ShoppingBagIcon,
//   UsersIcon,
//   BuildingOfficeIcon,
//   DocumentTextIcon,
// } from "@heroicons/react/24/outline";

// const cx = (...c) => c.filter(Boolean).join(" ");

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const location = useLocation();

//   const isActive = (path) => {
//     if (path === "/") return location.pathname === "/";
//     return location.pathname === path || location.pathname.startsWith(path + "/");
//   };

//   const sections = useMemo(
//     () => [
//       {
//         title: "Início",
//         items: [{ name: "Dashboard", path: "/", icon: HomeIcon }],
//       },
//       {
//         title: "Operação",
//         items: [
//           { name: "PDV", path: "/pdv", icon: ShoppingBagIcon },
//           { name: "Vendas", path: "/sales", icon: ShoppingCartIcon },
//           { name: "Orçamentos", path: "/quotes", icon: DocumentTextIcon },
//         ],
//       },
//       {
//         title: "Catálogo",
//         items: [
//           { name: "Produtos", path: "/products", icon: CubeIcon },
//           { name: "Estoque", path: "/inventory", icon: ClipboardDocumentListIcon },
//           { name: "Fornecedores", path: "/suppliers", icon: BuildingOfficeIcon },
//           { name: "Clientes", path: "/customers", icon: UsersIcon },
//         ],
//       },
//       {
//         title: "Gestão",
//         items: [
//           { name: "Despesas", path: "/expenses", icon: DocumentTextIcon },
//           { name: "Relatórios", path: "/reports", icon: ChartBarIcon },
//         ],
//       },
//     ],
//     []
//   );

//   // A11y: navegar por teclado dentro do menu
//   const linkRefs = useRef([]);
//   const onKeyDown = (e) => {
//     const list = linkRefs.current.filter(Boolean);
//     const i = list.findIndex((el) => el === document.activeElement);
//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       list[(i + 1) % list.length]?.focus();
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault();
//       list[(i - 1 + list.length) % list.length]?.focus();
//     } else if (e.key === "Home") {
//       e.preventDefault();
//       list[0]?.focus();
//     } else if (e.key === "End") {
//       e.preventDefault();
//       list[list.length - 1]?.focus();
//     } else if (e.key === "Escape") {
//       // fecha rápido no mobile
//       if (window.matchMedia("(max-width: 767px)").matches) toggleSidebar?.();
//     }
//   };

//   // overlay mobile
//   const MobileOverlay = () => (
//     <button
//       type="button"
//       aria-label="Fechar menu"
//       onClick={toggleSidebar}
//       className={cx(
//         "fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] transition-opacity md:hidden",
//         isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
//       )}
//     />
//   );

//   return (
//     <>
//       <MobileOverlay />

//       <aside
//         className={cx(
//           "fixed inset-y-0 left-0 z-40",
//           "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90",
//           "ring-1 ring-black/5 shadow-sm",
//           "transition-[width] duration-300",
//           isOpen ? "w-64" : "w-20"
//         )}
//         aria-label="Navegação principal"
//         data-open={isOpen ? "true" : "false"}
//       >
//         {/* Header minimalista */}
//         <div className="flex h-16 items-center gap-3 px-3">
//           <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white font-semibold shadow-sm">
//             FG
//           </div>
//           {isOpen && (
//             <div className="mr-auto leading-tight">
//               <div className="text-[15px] font-semibold text-gray-900 tracking-tight">FgFilms</div>
//               <div className="text-[11px] font-medium text-gray-400">Painel</div>
//             </div>
//           )}

//           <button
//             onClick={toggleSidebar}
//             aria-label="Alternar menu"
//             aria-expanded={isOpen}
//             className="ml-auto rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
//           >
//             {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
//           </button>
//         </div>

//         {/* Navegação */}
//         <nav
//           role="navigation"
//           aria-label="Seções"
//           onKeyDown={onKeyDown}
//           className="h-[calc(100%-64px)] overflow-y-auto pb-4"
//         >
//           {sections.map((section, sIdx) => (
//             <div key={section.title} className="px-2">
//               {isOpen ? (
//                 <div className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
//                   {section.title}
//                 </div>
//               ) : (
//                 <div className="pt-2" />
//               )}

//               <ul>
//                 {section.items.map((item, iIdx) => {
//                   const flatIdx =
//                     sections.slice(0, sIdx).reduce((acc, s) => acc + s.items.length, 0) + iIdx;
//                   const active = isActive(item.path);

//                   return (
//                     <li key={item.name} className="relative">
//                       {/* indicador sutil à esquerda */}
//                       {active && (
//                         <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-red-600" />
//                       )}

//                       <Link
//                         ref={(el) => (linkRefs.current[flatIdx] = el)}
//                         to={item.path}
//                         title={item.name}
//                         aria-current={active ? "page" : undefined}
//                         className={cx(
//                           "group mx-1 my-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium outline-none transition-all",
//                           active
//                             ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow ring-1 ring-red-500/30"
//                             : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900/10",
//                           !isOpen && "justify-center"
//                         )}
//                       >
//                         <item.icon
//                           className={cx(
//                             "h-5 w-5 flex-shrink-0 transition-colors",
//                             active ? "text-white" : "text-gray-400 group-hover:text-gray-700"
//                           )}
//                         />
//                         {/* label colapsável (acessível) */}
//                         <span
//                           className={cx("truncate", !isOpen && "sr-only")}
//                           aria-hidden={!isOpen}
//                         >
//                           {item.name}
//                         </span>

//                         {/* tooltip custom quando colapsado */}
//                         {!isOpen && (
//                           <span
//                             className={cx(
//                               "pointer-events-none absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2",
//                               "whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg",
//                               "opacity-0 translate-x-1 transition-all duration-150",
//                               "group-hover:opacity-100 group-hover:translate-x-0"
//                             )}
//                           >
//                             {item.name}
//                           </span>
//                         )}
//                       </Link>
//                     </li>
//                   );
//                 })}
//               </ul>

//               <div className="my-2 border-t border-gray-100" />
//             </div>
//           ))}
//         </nav>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;



import React, { useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UsersIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import logo from "../assets/img/logo.png";

const cx = (...c) => c.filter(Boolean).join(" ");

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const sections = useMemo(
    () => [
      {
        title: "Início",
        items: [{ name: "Dashboard", path: "/", icon: HomeIcon }],
      },
      {
        title: "Operação",
        items: [
          { name: "PDV", path: "/pdv", icon: ShoppingBagIcon },
          { name: "Vendas", path: "/sales", icon: ShoppingCartIcon },
          { name: "Orçamentos", path: "/quotes", icon: DocumentTextIcon },
        ],
      },
      {
        title: "Catálogo",
        items: [
          { name: "Produtos", path: "/products", icon: CubeIcon },
          { name: "Estoque", path: "/inventory", icon: ClipboardDocumentListIcon },
          { name: "Fornecedores", path: "/suppliers", icon: BuildingOfficeIcon },
          { name: "Clientes", path: "/customers", icon: UsersIcon },
        ],
      },
      {
        title: "Gestão",
        items: [
          { name: "Despesas", path: "/expenses", icon: DocumentTextIcon },
          { name: "Relatórios", path: "/reports", icon: ChartBarIcon },
        ],
      },
    ],
    []
  );

  // A11y: navegar por teclado dentro do menu
  const linkRefs = useRef([]);
  const onKeyDown = (e) => {
    const list = linkRefs.current.filter(Boolean);
    const i = list.findIndex((el) => el === document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      list[(i + 1) % list.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      list[(i - 1 + list.length) % list.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      list[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      list[list.length - 1]?.focus();
    } else if (e.key === "Escape") {
      if (window.matchMedia("(max-width: 767px)").matches) toggleSidebar?.();
    }
  };

  // Overlay mobile
  const MobileOverlay = () => (
    <button
      type="button"
      aria-label="Fechar menu"
      onClick={toggleSidebar}
      className={cx(
        "fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] transition-opacity md:hidden",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    />
  );

  // 👉 Fullscreen ao clicar no PDV
  const handleItemClick = (path) => async () => {
    if (path === "/pdv") {
      try {
        const el = document.documentElement; // ou document.getElementById("root")
        if (!document.fullscreenElement && el?.requestFullscreen) {
          await el.requestFullscreen();
        }
      } catch (err) {
        console.warn("Fullscreen falhou:", err);
      }
      if (window.matchMedia("(max-width: 767px)").matches && isOpen) {
        toggleSidebar?.();
      }
    }
  };

  return (
    <>
      <MobileOverlay />

      <aside
        className={cx(
          "fixed inset-y-0 left-0 z-40",
          "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90",
          "ring-1 ring-black/5 shadow-sm",
          "transition-[width] duration-300",
          isOpen ? "w-64" : "w-20"
        )}
        aria-label="Navegação principal"
        data-open={isOpen ? "true" : "false"}
      >
        {/* Header minimalista */}
        <div className="flex h-16 items-center gap-3 px-3">

          {isOpen && (
            <div className="mr-auto leading-tight">
              <img
                src={logo}
                alt="Venda-PRO"
                style={{ height: 70, width: 140, display: "block" }}
              />
            
            </div>
          )}

          <button
            onClick={toggleSidebar}
            aria-label="Alternar menu"
            aria-expanded={isOpen}
            className="ml-auto rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
          >
            {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

        {/* Navegação */}
        <nav
          role="navigation"
          aria-label="Seções"
          onKeyDown={onKeyDown}
          className="h-[calc(100%-64px)] overflow-y-auto pb-4"
        >
          {sections.map((section, sIdx) => (
            <div key={section.title} className="px-2">
              {isOpen ? (
                <div className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  {section.title}
                </div>
              ) : (
                <div className="pt-2" />
              )}

              <ul>
                {section.items.map((item, iIdx) => {
                  const flatIdx =
                    sections.slice(0, sIdx).reduce((acc, s) => acc + s.items.length, 0) + iIdx;
                  const active = isActive(item.path);

                  return (
                    <li key={item.name} className="relative">
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-red-600" />
                      )}

                      <Link
                        ref={(el) => (linkRefs.current[flatIdx] = el)}
                        to={item.path}
                        onClick={handleItemClick(item.path)}  // << fullscreen no PDV
                        title={item.name}
                        aria-current={active ? "page" : undefined}
                        className={cx(
                          "group mx-1 my-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium outline-none transition-all",
                          active
                            ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow ring-1 ring-red-500/30"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900/10",
                          !isOpen && "justify-center"
                        )}
                      >
                        <item.icon
                          className={cx(
                            "h-5 w-5 flex-shrink-0 transition-colors",
                            active ? "text-white" : "text-gray-400 group-hover:text-gray-700"
                          )}
                        />
                        <span
                          className={cx("truncate", !isOpen && "sr-only")}
                          aria-hidden={!isOpen}
                        >
                          {item.name}
                        </span>

                        {!isOpen && (
                          <span
                            className={cx(
                              "pointer-events-none absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2",
                              "whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg",
                              "opacity-0 translate-x-1 transition-all duration-150",
                              "group-hover:opacity-100 group-hover:translate-x-0"
                            )}
                          >
                            {item.name}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="my-2 border-t border-gray-100" />
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
