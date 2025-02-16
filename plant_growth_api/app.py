# app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api
from flask_migrate import Migrate
import os
from datetime import datetime
from werkzeug.utils import secure_filename
from models import db, Plant, PlantImage
from utils import calculate_green_density, calculate_growth_rate
from flask_cors import CORS

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Initialize Flask App
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB

# Initialize Extensions
db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Resources

class PlantListResource(Resource):
    def get(self):
        plants = Plant.query.all()
        data = []
        for plant in plants:
            data.append({
                'id': plant.id,
                'name': plant.name,
                'description': plant.description,
                'created_at': plant.created_at.isoformat()
            })
        return jsonify(data)
    
    def post(self):
        data = request.get_json()
        if not data or not 'name' in data:
            return {'message': 'Name is required'}, 400
        plant = Plant(
            name=data['name'],
            description=data.get('description', '')
        )
        db.session.add(plant)
        db.session.commit()
        return {
            'id': plant.id,
            'name': plant.name,
            'description': plant.description,
            'created_at': plant.created_at.isoformat()
        }, 201

class PlantImageListResource(Resource):
    def get(self, plant_id):
        plant = Plant.query.get_or_404(plant_id)
        images = PlantImage.query.filter_by(plant_id=plant.id).order_by(PlantImage.timestamp).all()
        data = []
        for img in images:
            data.append({
                'id': img.id,
                'plant_id': img.plant_id,
                'image_url': f'/uploads/{os.path.basename(img.image_path)}',
                'timestamp': img.timestamp.isoformat(),
                'green_density': img.green_density,
                'created_at': img.created_at.isoformat()
            })
        return jsonify(data)
    
    def post(self, plant_id):
        plant = Plant.query.get_or_404(plant_id)
        if 'image' not in request.files:
            return {'message': 'No image part'}, 400
        file = request.files['image']
        if file.filename == '':
            return {'message': 'No selected file'}, 400
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            timestamp_str = request.form.get('timestamp')
            if not timestamp_str:
                return {'message': 'Timestamp is required'}, 400
            try:
                timestamp = datetime.fromisoformat(timestamp_str)
            except ValueError:
                return {'message': 'Invalid timestamp format'}, 400
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            try:
                green_density = calculate_green_density(filepath)
            except Exception as e:
                os.remove(filepath)
                return {'message': str(e)}, 400
            plant_image = PlantImage(
                plant_id=plant.id,
                image_path=filepath,
                timestamp=timestamp,
                green_density=green_density
            )
            db.session.add(plant_image)
            db.session.commit()
            return {
                'id': plant_image.id,
                'plant_id': plant_image.plant_id,
                'image_url': f'/uploads/{filename}',
                'timestamp': plant_image.timestamp.isoformat(),
                'green_density': plant_image.green_density,
                'created_at': plant_image.created_at.isoformat()
            }, 201
        else:
            return {'message': 'File type not allowed'}, 400

class GrowthRateResource(Resource):
    def get(self, plant_id):
        plant = Plant.query.get_or_404(plant_id)
        images = PlantImage.query.filter_by(plant_id=plant.id).order_by(PlantImage.timestamp).all()
        if len(images) < 2:
            return {'message': 'Not enough images to calculate growth rate'}, 400

        # Prepare data points
        data_points = [{
            'timestamp': img.timestamp.isoformat(),
            'green_density': img.green_density
        } for img in images]

        # Calculate overall growth rate using the first and last images
        first_image = images[0]
        last_image = images[-1]
        time_diff = (last_image.timestamp - first_image.timestamp).days
        if time_diff == 0:
            return {'message': 'Time difference is zero'}, 400
        growth = calculate_growth_rate(first_image.green_density, last_image.green_density, time_diff)

        return {
            'plant_id': plant.id,
            'growth_rate': growth,
            'data_points': data_points,
            'calculation_details': {
                'density_t1': first_image.green_density,
                'density_t2': last_image.green_density,
                'time_difference_days': time_diff
            }
        }, 200

# Register Resources
api.add_resource(PlantListResource, '/api/plants')
api.add_resource(PlantImageListResource, '/api/plants/<int:plant_id>/images')
api.add_resource(GrowthRateResource, '/api/plants/<int:plant_id>/growth')

# Route to serve uploaded images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Run the App
if __name__ == '__main__':
    app.run(debug=True)