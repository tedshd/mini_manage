config = {
    'dev': {
        'apiHost': ''
    },
    'uat': {
        'apiHost': ''
    },
    'prd': {
        'apiHost': ''
    }
}

/**
 *
 * @returns 'dev' / 'uat' / 'prd'
 *
 */
export function env() {
    let env = 'dev';
    if (location.host === '') {
        env = 'uat'
    }
    if (location.host === '') {
        env = 'prd'
    }
    return {
        'env': env,
        ...config[env]
    }
}