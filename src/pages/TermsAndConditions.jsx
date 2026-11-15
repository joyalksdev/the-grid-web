import React from 'react';

const TermsAndConditions = () => {
  const terms = [
    {
      id: 1,
      title: "Keep the Premises Clean",
      description: "Please keep the gaming area clean and dispose of waste in the designated bins."
    },
    {
      id: 2,
      title: "No Feet on Walls",
      description: "Placing your feet or shoes on the walls, furniture, or gaming equipment is strictly prohibited."
    },
    {
      id: 3,
      title: "Protect Gaming Equipment",
      description: "Handle all PS5 consoles, controllers, TVs, steering wheels, and other equipment with care. Customers may be held responsible for repair or replacement costs for damage caused by misuse or negligence, subject to applicable law."
    },
    {
      id: 4,
      title: "No Controller Sharing",
      description: "Controller sharing is not permitted during a booked session. If you book a single-player session, you must use your allocated controller for the entire session."
    },
    {
      id: 5,
      title: "Respect Your Booking Time",
      description: "Your session begins and ends at the booked time. Extensions are subject to availability and additional charges."
    },
    {
      id: 6,
      title: "No Rough Handling",
      description: "Throwing controllers, hitting equipment, or engaging in any behaviour that may damage property is prohibited."
    },
    {
      id: 7,
      title: "Follow Staff Instructions",
      description: "Customers must follow staff instructions and maintain respectful behaviour towards other customers and staff."
    },
    {
      id: 8,
      title: "Personal Belongings",
      description: "Customers are responsible for their personal belongings. The Grid Gaming Lounge is not responsible for items left unattended."
    },
    {
      id: 9,
      title: "Payment Policy",
      description: "Payment must be completed according to the applicable pricing and booking policy."
    },
    {
      id: 10,
      title: "Right to Refuse Service",
      description: "The Grid Gaming Lounge reserves the right to refuse or discontinue service for serious misconduct, misuse of equipment, or repeated violations of these rules, subject to applicable law."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl uppercase">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-lg text-gray-400 uppercase tracking-widest">
            The Grid Gaming Lounge
          </p>
        </div>

        <div className="space-y-6 bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
          {terms.map((term) => (
            <div key={term.id} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0">
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                  {term.id}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {term.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {term.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          By completing a booking at The Grid Gaming Lounge, you agree to abide by these terms and conditions.
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;