import React, { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import BackArrow from '@/Components/BackArrow';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/inertia-react';

export default function Authenticated({ auth, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const doRenderBackArrow = [
        'entries.create',
        'entries.show',
        'entries.edit',
        'entries.create-upload',
        'markers.index',
        'mentions.index',
        'mentions.show',
        'snippets.index',
        'tags.index',
        'tags.show',
    ].includes(route().current());
    
    function routeBackArrow(currentRoute) {
        switch(currentRoute) {
            case 'entries.edit':
                const entryId = history?.state?.props?.entry?.id;
                if (entryId) {
                    return route('entries.show', entryId);
                }
            case 'markers.index':
            case 'mentions.index':
            case 'snippets.index':
            case 'tags.index':
                return route('entries.index');
            case 'mentions.show':
                // @todo: use cookies to store previous url, then nav back
                return route('mentions.index');
            case 'tags.show':
                // @todo: use cookies to store previous url, then nav back
                return route('tags.index');
        }
        return route('entries.index');
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            { !doRenderBackArrow && (
                                <div className="shrink-0 flex items-center">
                                    <Link href="/">
                                        <ApplicationLogo className="block h-9 w-auto text-gray-500" />
                                    </Link>
                                </div>
                            )}

                            { doRenderBackArrow && (
                                <div className="shrink-0 flex items-center">
                                    <Link href={routeBackArrow(route().current())}>
                                        <BackArrow className="block h-9 w-auto text-gray-600" />
                                    </Link>
                                </div>
                            )}

                            {/*
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink href={route('entries.index')} active={route().current('entries.index')}>
                                    View
                                </NavLink>
                            </div>
                            */}

                            <div className="hidden space-x-8 sm:-my-px sm:ml-8 sm:flex items-center">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                Entry

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        {/*
                                        <Dropdown.Link href={route('search.index')} as="button" method="get">
                                            Search
                                        </Dropdown.Link>
                                        */}

                                        <Dropdown.Link href={route('entries.index')} as="button" method="get">
                                            View
                                        </Dropdown.Link>

                                        <Dropdown.Link href={route('entries.create')} as="button" method="get">
                                            Create
                                        </Dropdown.Link>

                                        <Dropdown.Link href={route('entries.create-upload')} as="button" method="get">
                                            Upload
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-2 sm:flex items-center">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                Annotations

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('tags.index')} as="button" method="get">
                                            Tags
                                        </Dropdown.Link>

                                        <Dropdown.Link href={route('mentions.index')} as="button" method="get">
                                            Mentions
                                        </Dropdown.Link>

                                        <Dropdown.Link href={route('markers.index')} as="button" method="get">
                                            Markers
                                        </Dropdown.Link>

                                        <Dropdown.Link href={route('snippets.index')} as="button" method="get">
                                            Snippets
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {auth.user.name}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div>
                        <ResponsiveNavLink href={route('entries.index')} active={route().current('entries.index')}>
                            View
                        </ResponsiveNavLink>
                    </div>

                    <div className="pb-1">
                        <ResponsiveNavLink href={route('entries.create')} active={route().current('entries.create')}>
                            Create
                        </ResponsiveNavLink>
                    </div>

                    <div className="pb-1">
                        <ResponsiveNavLink href={route('tags.index')} active={route().current('tags.index')}>
                            Tags
                        </ResponsiveNavLink>
                    </div>

                    <div className="pb-1">
                        <ResponsiveNavLink href={route('mentions.index')} active={route().current('mentions.index')}>
                            Mentions
                        </ResponsiveNavLink>
                    </div>

                    <div className="pb-1">
                        <ResponsiveNavLink href={route('markers.index')} active={route().current('markers.index')}>
                            Markers
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{auth.user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{auth.user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main className="sm:pb-12">{children}</main>
        </div>
    );
}
