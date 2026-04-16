import PocketBase from 'pocketbase';

export const pocketbaseAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'Unauthorized' });

        const pb = new PocketBase(process.env.POCKETBASE_URL);
        pb.authStore.save(token);

        const isValid = await pb.authStore.isValid;
        if (!isValid) return res.status(401).json({ error: 'Invalid token' });

        req.pocketbaseUserId = pb.authStore.record?.id;
        req.pb = pb;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};