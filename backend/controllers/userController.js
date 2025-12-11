const userServices = require('../services/userServices');
const User = require('../models/Users');
const bcrypt = require('bcryptjs');

// GET all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userServices.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
};

// CREATE user
const createUser = async (req, res) => {
    try {
        const userData = await userServices.createUser(req.body);
        res.status(201).json(userData);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create user.' });
    }
};

// GET current user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                city: user.city,
                postalCode: user.postalCode,
                country: user.country,
                businessName: user.businessName,
                businessType: user.businessType,
                taxId: user.taxId,
                bankName: user.bankName,
                accountNumber: user.accountNumber,
                accountName: user.accountName,
                ewalletProvider: user.ewalletProvider,
                ewalletNumber: user.ewalletNumber,
                ewalletName: user.ewalletName,
                avatar: user.avatar,
                // Owner setup fields
                sellerType: user.sellerType,
                ownerAddress: user.ownerAddress,
                pickupAddress: user.pickupAddress,
                region: user.region,
                regionName: user.regionName,
                province: user.province,
                provinceName: user.provinceName,
                cityName: user.cityName,
                barangay: user.barangay,
                // Verification Status
                emailVerified: user.emailVerified || false,
                phoneVerified: user.phoneVerified || false,
                idVerified: user.idVerified || false,
            }
        });
    } catch (error) {
        console.error('[GET PROFILE] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile'
        });
    }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
    try {
        console.log('[UPDATE PROFILE] Request received');
        console.log('[UPDATE PROFILE] User ID:', req.user.userId);
        console.log('[UPDATE PROFILE] Body:', req.body);
        
        const userId = req.user.userId;
        const {
            firstName = undefined, 
            lastName = undefined, 
            email = undefined, 
            phone = undefined, 
            address = undefined, 
            city = undefined, 
            zipCode = undefined, 
            country = undefined,
            businessName = undefined, 
            businessType = undefined, 
            taxId = undefined,
            bankName = undefined, 
            accountNumber = undefined, 
            accountName = undefined,
            ewalletProvider = undefined, 
            ewalletNumber = undefined, 
            ewalletName = undefined,
            sellerType = undefined, 
            ownerAddress = undefined, 
            pickupAddress = undefined, 
            region = undefined, 
            regionName = undefined, 
            province = undefined, 
            provinceName = undefined, 
            cityName = undefined,
            barangay = undefined, 
            postalCode = undefined,
            ownerSetupCompleted = undefined,
            gender = undefined, 
            birthday = undefined, 
            bio = undefined, 
            avatar = undefined
        } = req.body;

        // Build update object with only provided fields
        const updateData = {};

        // Personal Information
        if (firstName !== undefined || lastName !== undefined) {
            const first = firstName || '';
            const last = lastName || '';
            updateData.name = `${first} ${last}`.trim();
        }
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (address !== undefined) updateData.address = address;
        if (city !== undefined) updateData.city = city;
        if (zipCode !== undefined) updateData.postalCode = zipCode;
        if (country !== undefined) updateData.country = country;
        if (gender !== undefined) updateData.gender = gender;
        if (birthday !== undefined) updateData.birthday = birthday;
        if (bio !== undefined) updateData.bio = bio;

        // Business Information
        if (businessName !== undefined) updateData.businessName = businessName;
        if (businessType !== undefined) updateData.businessType = businessType;
        if (taxId !== undefined) updateData.taxId = taxId;

        // Bank Information
        if (bankName !== undefined) updateData.bankName = bankName;
        if (accountNumber !== undefined) updateData.accountNumber = accountNumber;
        if (accountName !== undefined) updateData.accountName = accountName;

        // E-Wallet Information
        if (ewalletProvider !== undefined) updateData.ewalletProvider = ewalletProvider;
        if (ewalletNumber !== undefined) updateData.ewalletNumber = ewalletNumber;
        if (ewalletName !== undefined) updateData.ewalletName = ewalletName;

        // Owner Setup Fields
        if (sellerType !== undefined) updateData.sellerType = sellerType;
        if (ownerAddress !== undefined) updateData.ownerAddress = ownerAddress;
        if (pickupAddress !== undefined) updateData.pickupAddress = pickupAddress;
        if (region !== undefined) updateData.region = region;
        if (regionName !== undefined) updateData.regionName = regionName;
        if (province !== undefined) updateData.province = province;
        if (provinceName !== undefined) updateData.provinceName = provinceName;
        if (cityName !== undefined) updateData.cityName = cityName;
        if (barangay !== undefined) updateData.barangay = barangay;
        if (postalCode !== undefined) updateData.postalCode = postalCode;
        if (ownerSetupCompleted !== undefined) updateData.ownerSetupCompleted = ownerSetupCompleted;

        // Handle avatar upload if file exists or base64 string provided
        if (req.file) {
            const base64Avatar = req.file.buffer.toString('base64');
            updateData.avatar = `data:${req.file.mimetype};base64,${base64Avatar}`;
        } else if (avatar) {
            // Avatar is already a base64 string from frontend
            updateData.avatar = avatar;
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Return updated user with all fields
        res.json({
            success: true,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                role: updatedUser.role,
                phone: updatedUser.phone,
                address: updatedUser.address,
                city: updatedUser.city,
                postalCode: updatedUser.postalCode,
                country: updatedUser.country,
                gender: updatedUser.gender,
                birthday: updatedUser.birthday,
                bio: updatedUser.bio,
                businessName: updatedUser.businessName,
                businessType: updatedUser.businessType,
                taxId: updatedUser.taxId,
                bankName: updatedUser.bankName,
                accountNumber: updatedUser.accountNumber,
                accountName: updatedUser.accountName,
                ewalletProvider: updatedUser.ewalletProvider,
                ewalletNumber: updatedUser.ewalletNumber,
                ewalletName: updatedUser.ewalletName,
                sellerType: updatedUser.sellerType,
                ownerAddress: updatedUser.ownerAddress,
                pickupAddress: updatedUser.pickupAddress,
                region: updatedUser.region,
                regionName: updatedUser.regionName,
                province: updatedUser.province,
                provinceName: updatedUser.provinceName,
                barangay: updatedUser.barangay,
            }
        });
    } catch (error) {
        console.error('[UPDATE PROFILE] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile'
        });
    }
};

// UPDATE PASSWORD
const updatePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('[UPDATE PASSWORD] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update password: ' + error.message
        });
    }
};

// GET ADDRESSES
const getAddresses = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Return addresses (for now, return the main address)
        const addresses = user.address ? [{ id: 1, address: user.address, city: user.city, default: true }] : [];

        res.json({
            success: true,
            addresses
        });
    } catch (error) {
        console.error('[GET ADDRESSES] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch addresses'
        });
    }
};

// GET PAYMENT METHODS
const getPaymentMethods = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Return payment methods
        const paymentMethods = [];
        if (user.bankName && user.accountNumber) {
            paymentMethods.push({
                id: 1,
                type: 'bank',
                name: user.bankName,
                accountNumber: user.accountNumber,
                accountName: user.accountName,
                default: true
            });
        }
        if (user.ewalletProvider && user.ewalletNumber) {
            paymentMethods.push({
                id: 2,
                type: 'ewallet',
                provider: user.ewalletProvider,
                number: user.ewalletNumber,
                name: user.ewalletName
            });
        }

        res.json({
            success: true,
            paymentMethods
        });
    } catch (error) {
        console.error('[GET PAYMENT METHODS] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment methods'
        });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    getProfile,
    updateProfile,
    updatePassword,
    getAddresses,
    getPaymentMethods
};
