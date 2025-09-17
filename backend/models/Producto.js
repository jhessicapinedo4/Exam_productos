import mongoose, {model, Schema} from "mongoose"

const productoSchema = new Schema({
    nombre : {type:String, required : true},
    descripcion : {type:String , required : true},
    precio : {type:Number, required : true},
    stock : {
        type:Number, 
        required  : true, 
        validate: {
            validator : (value) => Number.isInteger(value),
            message : '{VALUE} Este no es un numero valido'

    }},
    categoria : {
        type:String, 
        required : true,
        enum : ['Polos', 'Pantalones', 'Zapatillas']
    }
})

export const Productos = mongoose.models.Productos || model("Productos", productoSchema)