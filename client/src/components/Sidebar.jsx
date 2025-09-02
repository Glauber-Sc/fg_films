import { useMemo, useRef } from "react";
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
        {isOpen && (
          <div className="mt-2 px-3">
            <img
              src={logo}
              alt="Venda-PRO"
              style={{ height: 85, width: 170, display: "block" }}
            />
          </div>
        )}

        {/* Navegação */}
        <nav
          role="navigation"
          aria-label="Seções"
          onKeyDown={onKeyDown}
        >
          {sections.map((section, sIdx) => (
            <div key={section.title} className="px-2">
              {isOpen ? (
                <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
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
         <div className="flex">
  <button
    onClick={toggleSidebar}
    aria-label="Alternar menu"
    aria-expanded={isOpen}
    className="ml-auto rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
  >
    {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
  </button>
</div>

        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
