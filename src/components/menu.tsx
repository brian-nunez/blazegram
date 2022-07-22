import React, { useState, useMemo, ReactComponentElement } from 'react';
import classnames from 'classnames';
import Link from 'next/link';

type MenuProps = {
  label: React.ReactNode | string,
  children?: React.ReactNode,
  optionWrapperClassNames?: string,
}

function Menu({
  label,
  children,
  optionWrapperClassNames = '',
}: MenuProps) {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(prevShow => !prevShow);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border-gray-300 shadow-sm p-0 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-black"
          onClick={toggle}
        >
          {label}
        </button>
      </div>
      <div
        className={classnames(
          "origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none",
          { 'hidden': !show },
          optionWrapperClassNames
        )}
      >
        <div className="py-1" role="none">
          {children}
        </div>
      </div>
    </div>
  );
}

type MenuItemProps = {
  type: 'link',
  href: string,
  children: React.ReactNode,
  onClick?: () => void,
} | {
  type: 'button',
  href?: string,
  children: React.ReactNode,
  onClick: () => void,
}

const MenuItem: React.FC<MenuItemProps> = ({
  type,
  href,
  onClick,
  children,
}) => {
  const element = useMemo(() => {
    const classNames = 'text-gray-700 block w-full text-left px-4 py-2 text-sm';
    if (type === 'link') {
      return (
        <Link href={href}>
          <a className={classNames}>
            {children}
          </a>
        </Link>
      );
    }
    return (
      <button
        className={classNames}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }, [type, children, href, onClick]);

  return element;
}

Menu.MenuItem = MenuItem;

export default Menu;
