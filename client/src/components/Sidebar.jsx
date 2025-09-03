import { useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Box,
  ShoppingCart,
  ClipboardList,
  BarChart,
  ShoppingBag,
  Users,
  Building,
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";

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
        items: [{ name: "Dashboard", path: "/", icon: Home }],
      },
      {
        title: "Operação",
        items: [
          { name: "PDV", path: "/pdv", icon: ShoppingBag },
          { name: "Vendas", path: "/sales", icon: ShoppingCart },
          { name: "Orçamentos", path: "/quotes", icon: FileText },
        ],
      },
      {
        title: "Catálogo",
        items: [
          { name: "Produtos", path: "/products", icon: Box },
          { name: "Estoque", path: "/inventory", icon: ClipboardList },
          { name: "Fornecedores", path: "/suppliers", icon: Building },
          { name: "Clientes", path: "/customers", icon: Users },
        ],
      },
      {
        title: "Gestão",
        items: [
          { name: "Despesas", path: "/expenses", icon: FileText },
          { name: "Relatórios", path: "/reports", icon: BarChart },
        ],
      },
    ],
    []
  );

  // A11y: navegação por teclado
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

  // Fullscreen ao clicar no PDV (opcional)
  const handleItemClick = (path) => async () => {
    if (path === "/pdv") {
      try {
        const el = document.documentElement;
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

  // Handler de logout (substitua pela sua lógica)
  const handleLogout = () => {
    // TODO: implemente seu logout aqui
    console.log("logout");
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
          isOpen ? "w-60" : "w-20",
          // layout em coluna para rodapé colado embaixo
          "flex flex-col"
        )}
        aria-label="Navegação principal"
        data-open={isOpen ? "true" : "false"}
      >
        {/* Header */}
        {isOpen && (
          <div className="mt-2 px-3">
            <img
              src={logo}
              alt="Venda-PRO"
              style={{ height: 85, width: 170, display: "block" }}
            />
          </div>
        )}

        {/* Navegação (ocupa o meio) */}
        <nav
          role="navigation"
          aria-label="Seções"
          onKeyDown={onKeyDown}
          className="flex-1 overflow-y-auto"
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
                        onClick={handleItemClick(item.path)}
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

                        {/* Tooltip: não gera largura => some o scroll horizontal */}
                        {!isOpen && (
                          <span
                            className={cx(
                              "pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2",
                              "whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg",
                              "hidden group-hover:block group-focus-visible:block"
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

        {/* Rodapé fixo: Sair (esquerda) + X/Menu (direita) */}
        <div className="mt-auto border-t border-gray-100 p-2">
          <div className={cx("flex items-center", isOpen ? "justify-between" : "justify-end")}>
            {isOpen && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900/10"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span>Sair</span>
              </button>
            )}

            <button
              onClick={toggleSidebar}
              aria-label="Alternar menu"
              aria-expanded={isOpen}
              className="rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
            >
              {isOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
