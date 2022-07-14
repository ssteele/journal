import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, Head } from '@inertiajs/inertia-react';
import React from 'react';

export default function Welcome(props) {
    const canRegister = false;

    return (
        <>
            <Head title="Welcome" />
            <div className="relative flex justify-center min-h-screen bg-gray-100 dark:bg-gray-900 items-center sm:pt-0">
                <div className="fixed top-0 right-0 px-6 py-4 sm:block">
                    {props.auth.user ? (
                        <>
                            <Link href={route('entries.create')} className="pr-4 text-sm text-gray-700 underline">
                                Create
                            </Link>

                            <Link href={route('entries.index')} className="pr-4 text-sm text-gray-700 underline">
                                View
                            </Link>

                            <Link href={route('upload')} className="text-sm text-gray-700 underline">
                                Upload
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href={route('login')} className="text-sm text-gray-700 underline">
                                Log in
                            </Link>

                            {canRegister && (
                                <Link href={route('register')} className="ml-4 text-sm text-gray-700 underline">
                                    Register
                                </Link>
                            )}
                        </>
                    )}
                </div>

                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="flex justify-center pt-8 sm:justify-start text-6xl">
                        <ApplicationLogo className="block h-32 w-auto text-gray-500" />ournal
                    </h1>
                </div>
            </div>
        </>
    );
}
