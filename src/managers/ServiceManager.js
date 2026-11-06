import crypto from "crypto";

class ServiceManager {

    services = []
    constructor() {
        this.services = [];
    }

    getServices() {
        return this.services;
    }

    getServicesById(id) {
        return this.services.find(service => service.id === id);
    }

    createService(name, description, duration, price, category, available) {
        try {
            if(!name || !description || !duration || !price || !category || !available) {
                throw new Error("Todos los campos son requeridos");
            }

            const newService = {
                id: crypto.randomUUID(),
                name,
                description,
                duration,
                price,
                category,
                available
            };

            this.services.push(newService);

            return newService;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    updateService(id, data) {
        try {
            const service = this.getServicesById(id);
            if (!service) { 
                throw new Error("Servicio no encontrado");
            }

            service.name = data.name ?? service.name;
            service.description = data.description ?? service.description;
            service.duration = data.duration ?? service.duration;
            service.category = data.category ?? service.category;
            service.price = data.price ?? service.price;
            service.available = data.available ?? service.available;
            return service;
            
        } catch (error) {
            console.error(error);
            return null;
        }

    }

    deleteService(id) {
        const index = this.services.findIndex(service => service.id === id);
        if (index === -1) { return null; }
        return this.services.splice(index, 1)[0];
    }
}

export default ServiceManager;