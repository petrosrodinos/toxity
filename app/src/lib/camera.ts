import { Capacitor } from "@capacitor/core";
import {
    Camera,
    CameraResultType,
    CameraSource,
} from "@capacitor/camera";

export const is_android_native = (): boolean =>
    Capacitor.isNativePlatform() && Capacitor.getPlatform() === "android";

export const request_camera_permission = async (): Promise<boolean> => {
    if (!is_android_native()) {
        return true;
    }

    const current = await Camera.checkPermissions();
    if (current.camera === "granted") {
        return true;
    }

    const requested = await Camera.requestPermissions({ permissions: ["camera"] });
    return requested.camera === "granted";
};

export const capture_photo_file = async (): Promise<File> => {
    const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
    });

    const format = photo.format || "jpeg";
    const base64 = photo.base64String;

    if (!base64) {
        throw new Error("Could not read captured photo.");
    }

    const mime_type = `image/${format}`;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
    }

    return new File([bytes], `capture-${Date.now()}.${format}`, {
        type: mime_type,
    });
};
