import React from 'react'

const Header: React.FC = () => {
  return (
    <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow">
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <a
            className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
            href="/"
          >
            Sapphire Mall
          </a>
          <button
            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
        <div className="lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none hidden">
          <ul className="flex flex-col lg:flex-row list-none mr-auto">
            <li className="flex items-center">
              <a
                className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                href="#docs"
              >
                <i className="text-blueGray-400 far fa-file-alt text-lg leading-lg mr-2"></i>
                Docs
              </a>
            </li>
          </ul>
          <ul className="flex flex-col lg:flex-row list-none lg:ml-auto items-center">
            <li className="inline-block relative">
              <a
                className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                href="#demo"
              >
                Demo Pages
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header
