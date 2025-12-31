/**
 * Middleware de vérification des rôles
 * @param {Array} roles - Tableau des rôles autorisés
 */
export const checkRole = (roles) => {
    return (req, res, next) => {
        // Vérifier que l'utilisateur est authentifié
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentification requise.'
            });
        }

        // Vérifier que l'utilisateur a le rôle requis
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Accès refusé. Rôle requis : ${roles.join(' ou ')}. Votre rôle : ${req.user.role}`
            });
        }

        next();
    };
};

// Middlewares prédéfinis pour les rôles courants
export const isAdmin = checkRole(['ADMIN']);
export const isAdminOrAssistant = checkRole(['ADMIN', 'ASSISTANT']);
export const isFormateur = checkRole(['FORMATEUR']);
export const isAuthenticated = checkRole(['ADMIN', 'FORMATEUR', 'ASSISTANT']);

export default checkRole;
