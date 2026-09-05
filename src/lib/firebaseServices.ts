import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  Unsubscribe
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { sanitizeString, stripDangerousTags } from './security';

export type AdminRole = 'foodcourt_admin' | 'restaurant_admin' | 'superadmin';

export interface AdminProfile {
  uid: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt?: string | Timestamp;
  updatedAt?: string | Timestamp;
}

export interface FirestoreRestaurant {
  id?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  cuisine: string;
  imageUrl: string;
  rating: number;
  status: 'active' | 'inactive';
  phone?: string;
  pricing?: string;
  createdBy?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface FirestoreFoodCourtItem {
  id?: string;
  name: string;
  stallId: string;
  stallName: string;
  price: number;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  status: 'active' | 'inactive';
  imageUrl?: string;
  rating?: number;
  description?: string;
  createdBy?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface FirestoreOrder {
  id?: string;
  tokenNumber: string;
  studentRegNo: string;
  studentName?: string;
  studentPhone?: string;
  stallId: string;
  stallName?: string;
  totalAmount: number;
  status: 'received' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  deliveryLocation?: string;
  orderType: 'pickup' | 'academic_delivery' | 'canteen_dinein';
  createdAt?: any;
  updatedAt?: any;
}

export interface FirestoreFeedback {
  id?: string;
  mealType: string;
  messHall: string;
  rating: number;
  category?: string;
  comment: string;
  status: 'open' | 'reviewed' | 'resolved';
  createdAt?: any;
  updatedAt?: any;
}

// ============================================================================
// 1. AUTHENTICATION SERVICES (Shared between Food Court & Restaurant Admins)
// ============================================================================

/**
 * Log in an admin with Email and Password and retrieve their role.
 */
export async function loginWithFirebaseAuth(emailInput: string, passwordInput: string): Promise<{ user: User; profile: AdminProfile }> {
  const cleanEmail = sanitizeString(emailInput.trim().toLowerCase());
  if (!cleanEmail || !passwordInput) {
    throw new Error('Please provide both email and password.');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, passwordInput);
    const user = userCredential.user;

    // Fetch Admin Profile from /admins/{uid}
    const adminDocRef = doc(db, 'admins', user.uid);
    let adminProfile: AdminProfile;

    try {
      const adminSnap = await getDoc(adminDocRef);
      if (adminSnap.exists()) {
        const data = adminSnap.data();
        adminProfile = {
          uid: user.uid,
          email: user.email || cleanEmail,
          name: data.name || 'Admin',
          role: (data.role as AdminRole) || 'superadmin'
        };
      } else {
        // Fallback for bootstrap / initial superadmin
        const isSuperAdminEmail = cleanEmail.includes('admin') || cleanEmail.includes('shre');
        const defaultRole: AdminRole = isSuperAdminEmail ? 'superadmin' : 'foodcourt_admin';
        adminProfile = {
          uid: user.uid,
          email: user.email || cleanEmail,
          name: user.displayName || 'Authorized Administrator',
          role: defaultRole
        };
      }
    } catch {
      adminProfile = {
        uid: user.uid,
        email: user.email || cleanEmail,
        name: 'Authorized Administrator',
        role: 'superadmin'
      };
    }

    return { user, profile: adminProfile };
  } catch (error: any) {
    let friendlyMessage = 'Authentication failed. Please check your credentials.';
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      friendlyMessage = 'Invalid email or password. Please verify your admin credentials.';
    } else if (error.code === 'auth/too-many-requests') {
      friendlyMessage = 'Access temporarily locked due to many failed attempts. Please try again later.';
    } else if (error.code === 'auth/network-request-failed') {
      friendlyMessage = 'Network error. Please check your internet connection.';
    }
    throw new Error(friendlyMessage);
  }
}

/**
 * Log out the currently authenticated admin.
 */
export async function logoutFirebaseAuth(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out of Firebase:', error);
    throw new Error('Failed to log out. Please try again.');
  }
}

/**
 * Listen to auth state changes and fetch profile.
 */
export function subscribeToAuth(callback: (user: User | null, profile: AdminProfile | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null, null);
      return;
    }

    try {
      const adminSnap = await getDoc(doc(db, 'admins', user.uid));
      if (adminSnap.exists()) {
        const data = adminSnap.data();
        callback(user, {
          uid: user.uid,
          email: user.email || '',
          name: data.name || 'Admin',
          role: data.role || 'superadmin'
        });
      } else {
        callback(user, {
          uid: user.uid,
          email: user.email || '',
          name: 'Administrator',
          role: 'superadmin'
        });
      }
    } catch {
      callback(user, {
        uid: user.uid,
        email: user.email || '',
        name: 'Administrator',
        role: 'superadmin'
      });
    }
  });
}

// ============================================================================
// 2. REAL-TIME SUBSCRIPTIONS (Firestore Snapshots)
// ============================================================================

/**
 * Subscribe to real-time updates for active restaurants.
 */
export function subscribeToRestaurants(callback: (restaurants: FirestoreRestaurant[]) => void): Unsubscribe {
  const q = query(collection(db, 'restaurants'), where('status', '==', 'active'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FirestoreRestaurant));
    callback(list);
  }, (error) => {
    console.warn('Restaurants listener fallback:', error.message);
  });
}

/**
 * Subscribe to real-time updates for food court items.
 */
export function subscribeToFoodCourtItems(callback: (items: FirestoreFoodCourtItem[]) => void): Unsubscribe {
  const q = query(collection(db, 'foodcourt_items'), where('status', '==', 'active'));
  return onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FirestoreFoodCourtItem));
    callback(list);
  }, (error) => {
    console.warn('Food court items listener fallback:', error.message);
  });
}

/**
 * Subscribe to real-time updates for live orders.
 */
export function subscribeToOrders(callback: (orders: FirestoreOrder[]) => void): Unsubscribe {
  return onSnapshot(collection(db, 'orders'), (snapshot) => {
    const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FirestoreOrder));
    callback(list);
  }, (error) => {
    console.warn('Orders listener fallback:', error.message);
  });
}

// ============================================================================
// 3. RESTAURANTS CRUD
// ============================================================================

export async function fetchActiveRestaurants(): Promise<FirestoreRestaurant[]> {
  const collectionPath = 'restaurants';
  try {
    const q = query(collection(db, collectionPath), where('status', '==', 'active'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as FirestoreRestaurant)
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
}

export async function fetchAllRestaurants(): Promise<FirestoreRestaurant[]> {
  const collectionPath = 'restaurants';
  try {
    const snapshot = await getDocs(collection(db, collectionPath));
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as FirestoreRestaurant)
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
}

export async function addRestaurant(restaurant: Omit<FirestoreRestaurant, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const collectionPath = 'restaurants';
  if (!restaurant.name || restaurant.name.trim().length < 2) {
    throw new Error('Restaurant name is required (minimum 2 characters).');
  }
  if (!restaurant.address || restaurant.address.trim().length < 3) {
    throw new Error('Restaurant address is required (minimum 3 characters).');
  }
  if (typeof restaurant.latitude !== 'number' || typeof restaurant.longitude !== 'number') {
    throw new Error('Valid geographic coordinates (latitude/longitude) are required.');
  }

  const sanitizedData = {
    name: stripDangerousTags(restaurant.name.trim()),
    address: stripDangerousTags(restaurant.address.trim()),
    latitude: Number(restaurant.latitude),
    longitude: Number(restaurant.longitude),
    cuisine: stripDangerousTags(restaurant.cuisine || 'Multi-Cuisine'),
    imageUrl: stripDangerousTags(restaurant.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'),
    rating: Math.min(5, Math.max(0, Number(restaurant.rating) || 4.5)),
    status: restaurant.status === 'inactive' ? 'inactive' : 'active',
    phone: stripDangerousTags(restaurant.phone || '+91 9335568951'),
    pricing: stripDangerousTags(restaurant.pricing || '₹150 for two'),
    createdBy: auth.currentUser?.uid || 'admin',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, collectionPath), sanitizedData);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, collectionPath);
  }
}

export async function updateRestaurant(id: string, updates: Partial<Omit<FirestoreRestaurant, 'id' | 'createdAt'>>): Promise<void> {
  const docPath = `restaurants/${id}`;
  if (!id) throw new Error('Restaurant ID is required.');

  const sanitizedUpdates: Record<string, any> = {
    updatedAt: serverTimestamp()
  };

  if (updates.name !== undefined) sanitizedUpdates.name = stripDangerousTags(updates.name.trim());
  if (updates.address !== undefined) sanitizedUpdates.address = stripDangerousTags(updates.address.trim());
  if (updates.latitude !== undefined) sanitizedUpdates.latitude = Number(updates.latitude);
  if (updates.longitude !== undefined) sanitizedUpdates.longitude = Number(updates.longitude);
  if (updates.cuisine !== undefined) sanitizedUpdates.cuisine = stripDangerousTags(updates.cuisine);
  if (updates.imageUrl !== undefined) sanitizedUpdates.imageUrl = stripDangerousTags(updates.imageUrl);
  if (updates.rating !== undefined) sanitizedUpdates.rating = Math.min(5, Math.max(0, Number(updates.rating)));
  if (updates.status !== undefined) sanitizedUpdates.status = updates.status;
  if (updates.phone !== undefined) sanitizedUpdates.phone = stripDangerousTags(updates.phone);
  if (updates.pricing !== undefined) sanitizedUpdates.pricing = stripDangerousTags(updates.pricing);

  try {
    await updateDoc(doc(db, 'restaurants', id), sanitizedUpdates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

export async function deleteRestaurant(id: string): Promise<void> {
  const docPath = `restaurants/${id}`;
  if (!id) throw new Error('Restaurant ID is required.');

  try {
    await deleteDoc(doc(db, 'restaurants', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

// ============================================================================
// 4. FOOD COURT ITEMS CRUD
// ============================================================================

export async function fetchActiveFoodCourtItems(stallId?: string): Promise<FirestoreFoodCourtItem[]> {
  const collectionPath = 'foodcourt_items';
  try {
    let q = query(collection(db, collectionPath), where('status', '==', 'active'));
    if (stallId) {
      q = query(collection(db, collectionPath), where('status', '==', 'active'), where('stallId', '==', stallId));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as FirestoreFoodCourtItem)
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionPath);
  }
}

export async function addFoodCourtItem(item: Omit<FirestoreFoodCourtItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const collectionPath = 'foodcourt_items';
  if (!item.name || item.name.trim().length < 2) {
    throw new Error('Dish name is required (minimum 2 characters).');
  }
  if (!item.stallId || !item.stallName) {
    throw new Error('Stall ID and Stall Name are required.');
  }
  if (typeof item.price !== 'number' || item.price < 0) {
    throw new Error('Price must be a valid non-negative number.');
  }

  const sanitizedData = {
    name: stripDangerousTags(item.name.trim()),
    stallId: stripDangerousTags(item.stallId),
    stallName: stripDangerousTags(item.stallName),
    price: Number(item.price),
    category: stripDangerousTags(item.category || 'Special'),
    isVeg: Boolean(item.isVeg),
    isAvailable: item.isAvailable !== false,
    status: item.status === 'inactive' ? 'inactive' : 'active',
    imageUrl: stripDangerousTags(item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'),
    rating: Math.min(5, Math.max(0, Number(item.rating) || 4.5)),
    description: stripDangerousTags(item.description || ''),
    createdBy: auth.currentUser?.uid || 'admin',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, collectionPath), sanitizedData);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, collectionPath);
  }
}

export async function updateFoodCourtItem(id: string, updates: Partial<Omit<FirestoreFoodCourtItem, 'id' | 'createdAt'>>): Promise<void> {
  const docPath = `foodcourt_items/${id}`;
  if (!id) throw new Error('Item ID is required.');

  const sanitizedUpdates: Record<string, any> = {
    updatedAt: serverTimestamp()
  };

  if (updates.name !== undefined) sanitizedUpdates.name = stripDangerousTags(updates.name.trim());
  if (updates.stallId !== undefined) sanitizedUpdates.stallId = stripDangerousTags(updates.stallId);
  if (updates.stallName !== undefined) sanitizedUpdates.stallName = stripDangerousTags(updates.stallName);
  if (updates.price !== undefined) sanitizedUpdates.price = Number(updates.price);
  if (updates.category !== undefined) sanitizedUpdates.category = stripDangerousTags(updates.category);
  if (updates.isVeg !== undefined) sanitizedUpdates.isVeg = Boolean(updates.isVeg);
  if (updates.isAvailable !== undefined) sanitizedUpdates.isAvailable = Boolean(updates.isAvailable);
  if (updates.status !== undefined) sanitizedUpdates.status = updates.status;
  if (updates.imageUrl !== undefined) sanitizedUpdates.imageUrl = stripDangerousTags(updates.imageUrl);
  if (updates.rating !== undefined) sanitizedUpdates.rating = Math.min(5, Math.max(0, Number(updates.rating)));
  if (updates.description !== undefined) sanitizedUpdates.description = stripDangerousTags(updates.description);

  try {
    await updateDoc(doc(db, 'foodcourt_items', id), sanitizedUpdates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

export async function deleteFoodCourtItem(id: string): Promise<void> {
  const docPath = `foodcourt_items/${id}`;
  if (!id) throw new Error('Item ID is required.');

  try {
    await deleteDoc(doc(db, 'foodcourt_items', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

// ============================================================================
// 5. ORDERS & FEEDBACK CRUD
// ============================================================================

export async function createFirestoreOrder(order: Omit<FirestoreOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const collectionPath = 'orders';
  const sanitized = {
    tokenNumber: stripDangerousTags(order.tokenNumber),
    studentRegNo: stripDangerousTags(order.studentRegNo),
    studentName: stripDangerousTags(order.studentName || 'Student'),
    studentPhone: stripDangerousTags(order.studentPhone || ''),
    stallId: stripDangerousTags(order.stallId),
    stallName: stripDangerousTags(order.stallName || 'Food Court Stall'),
    totalAmount: Number(order.totalAmount),
    status: order.status || 'received',
    deliveryLocation: stripDangerousTags(order.deliveryLocation || ''),
    orderType: order.orderType || 'pickup',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, collectionPath), sanitized);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, collectionPath);
  }
}

export async function updateFirestoreOrderStatus(orderId: string, status: FirestoreOrder['status']): Promise<void> {
  const docPath = `orders/${orderId}`;
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

export async function submitFirestoreFeedback(feedback: Omit<FirestoreFeedback, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const collectionPath = 'feedback';
  const sanitized = {
    mealType: stripDangerousTags(feedback.mealType),
    messHall: stripDangerousTags(feedback.messHall),
    rating: Number(feedback.rating),
    category: stripDangerousTags(feedback.category || 'General Quality'),
    comment: stripDangerousTags(feedback.comment),
    status: feedback.status || 'open',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    const docRef = await addDoc(collection(db, collectionPath), sanitized);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, collectionPath);
  }
}

